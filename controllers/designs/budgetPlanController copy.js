var pdfMakePrinter = require('pdfmake');
const fs = require('fs')
const lodash = require('lodash');

const User = require('../../models/user');
const Design = require('../../models/design');
const DesignBudgetPlan = require('../../models/design_budget_plan');
const { metadata, dd } = require("../../budget_plans/budget_plan");

const designService = require('../../services/design');

const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');


const createBudgetPlan = async (req, res, next) => {
    try {
        const content = req.body;
        const designId = req.params.id;
        let totalPrice = 0;

        await DesignBudgetPlan.findOne({ where: { design_id: designId } })
            && (() => { throw new ClientError("BUDGET_PLAN_ALREADY_EXISTS", 409) })();

        await Object.keys(content).forEach(async category => {
            content[category].total = 0;
            await content[category].data.forEach(async row => {
                row.total = parseFloat((row.volume * row.harga).toFixed(2));
                content[category].total += row.total;

                await DesignBudgetPlan.create({
                    design_id: designId,
                    category,
                    name: row.uraian,
                    volume: row.volume,
                    unit: row.satuan,
                    cost: row.harga,
                });
            });
            content[category].total = parseFloat(content[category].total.toFixed(2));
            totalPrice += content[category].total;
        });

        // Get design data for 
        const design = await Design.findOne({
            attributes: ['id', 'title'],
            where: { id: designId },
            include: {
                attributes: ['id', 'name', 'image'],
                model: User
            },
        });

        const fileName = await createBudgetPlanDocument(
            designId,
            content,
            {
                title: design.title,
                author: design.user.name
            }
        );

        await Design.update({
            budget_plan: fileName,
            price: Math.ceil(totalPrice)
        }, {
            where: {
                id: req.params.id
            }
        });

        await res.status(201).json({
            code: 201,
            data: {
                fileName,
                url: `${req.headers.host}/uploads/budget-plans/${fileName}`
            }
        });
    } catch (error) {
        next(error);
    }
}

const createBudgetPlanDocument = async (id, payload, info) => {
    const fonts = {
        Roboto: {
            normal: 'fonts/Roboto-Regular.ttf',
            bold: 'fonts/Roboto-Bold.ttf',
            italics: 'fonts/Roboto-Italic.ttf',
        }
    };

    const printer = new pdfMakePrinter(fonts);
    const doc = printer.createPdfKitDocument(
        dd(metadata(payload, info))
    );

    const fileName = `${id}-budget-plan-${(+new Date())}.pdf`;
    doc.pipe(fs.createWriteStream(`uploads/budget-plans/${fileName}`));
    doc.end();

    return fileName;
}

const getBudgetPlan = async (req, res, next) => {
    try {
        const budgetPlans = await DesignBudgetPlan.findAll({
            where: {
                design_id: req.params.id
            }
        });

        if (!budgetPlans.length) throw new NotFoundError('BUDGET_PLAN_NOT_FOUND');

        const data = lodash(budgetPlans).groupBy('category');
        res.json({
            code: 200,
            data
        });
    } catch (error) {
        next(error);
    }
}

const getBudgetPlanPdf = async (req, res, next) => {
    try {
        const design = await designService.getDesignById(req.params.id);

        if (!design.budget_plan) throw new NotFoundError('BUDGET_PLAN_NOT_FOUND');

        const dir = require('path').resolve('uploads', "budget-plans", design.budget_plan);

        if (!fs.existsSync(dir)) {
            throw new NotFoundError("FILE_NOT_FOUND");
        }
        res.sendFile(dir);
    } catch (error) {
        next(error);
    }
}

const deleteBudgetPlan = async (req, res, next) => {
    try {
        const budgetPlans = await DesignBudgetPlan.destroy({
            where: {
                design_id: req.params.id
            }
        });

        if (!budgetPlans) throw new NotFoundError('BUDGET_PLAN_NOT_FOUND');

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createBudgetPlan,
    getBudgetPlan,
    getBudgetPlanPdf,
    deleteBudgetPlan
};