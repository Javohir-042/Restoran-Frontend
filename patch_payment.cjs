const fs = require('fs');
const path = require('path');

const servicePath = '/home/javohir/Loyihalar/Restoran_01/Restoran/src/api/payment/payment.service.ts';
let serviceCode = fs.readFileSync(servicePath, 'utf-8');

if (!serviceCode.includes('findDailyHistory')) {
    const historyCode = `
    async findDailyHistory(): Promise<ISuccess> {
        const startOfDay = new Date();
        startOfDay.setHours(0,0,0,0);
        
        const data = await this.paymentRepo.find({
            where: { createdAt: require('typeorm').MoreThanOrEqual(startOfDay) },
            relations: ['receivedByStaff', 'cancelledByStaff'],
            order: { createdAt: 'DESC' },
        });
        return getSuccessRes(this.formatMany(data));
    }
`;
    // Insert before `private formatOne`
    serviceCode = serviceCode.replace('private formatOne', historyCode + '\n    private formatOne');
    fs.writeFileSync(servicePath, serviceCode);
}

const controllerPath = '/home/javohir/Loyihalar/Restoran_01/Restoran/src/api/payment/payment.controller.ts';
let controllerCode = fs.readFileSync(controllerPath, 'utf-8');

if (!controllerCode.includes("@Get('history')")) {
    const routeCode = `
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(StaffRole.KASSIR, AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @Get('history')
    @ApiOperation({ summary: 'Bugungi tolovlar tarixi' })
    history() {
        return this.paymentService.findDailyHistory();
    }
`;
    // Insert before byBill route
    controllerCode = controllerCode.replace("@Get('bill/:billId')", routeCode + "\n    @Get('bill/:billId')");
    fs.writeFileSync(controllerPath, controllerCode);
}

const reportsPath = '/home/javohir/Loyihalar/Restoran_01/Restoran/src/api/reports/reports.controller.ts';
let reportsCode = fs.readFileSync(reportsPath, 'utf-8');

// I need to add StaffRole to the summary route and import it
if (!reportsCode.includes('StaffRole.KASSIR')) {
    reportsCode = "import { StaffRole } from '../../common/enum/staff-role.enum';\n" + reportsCode;
    reportsCode = reportsCode.replace(
        `@Get('summary')`,
        `@Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, StaffRole.KASSIR)\n    @Get('summary')`
    );
    fs.writeFileSync(reportsPath, reportsCode);
}
console.log('DONE');
