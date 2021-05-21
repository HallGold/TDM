const serviceOperateType = {
    CREATE: `创建服务单`,
    DELETE: `删除服务单`,
    DELIVER: `调度中心分派服务单`,
    QUICK_RESOLVE: `调度中心快速解决服务单`,
    CANCEL: `调度中心取消服务单`,
    CANCEL_WORK_TICKET: `调度中心取消分派`,
    REFUSE_RETURN: `调度中心拒绝退回`,
    REFUSE_SHIFT: `调度中心拒绝转派`,
    REFUSE_UPGRADE: `调度中心拒绝升级`,
    ACCEPT_HANGUP: `调度中心确认挂起`,
    REFUSE_HANGUP: `调度中心拒绝挂起`,
    RELEASE_HANGUP: `调度中心解除挂起`,
    ACCEPT_REWORK: `调度中心确认返工`,
    ACCEPT_REWORK_NUM: 11,
    REFUSE_REWORK: `调度中心拒绝返工`,
    REFUSE_REWORK_NUM: 12,
    ACCEPT_RETURN: `调度中心确认退回`,
    ACCEPT_SHIFT: `调度中心确认转派`,
    ACCEPT_UPGRADE: `调度中心确认升级`,
    ACCEPT_FEEDBACK: `用户评价已解决`,
    REFUSE_FEEDBACK: `用户评价未解决`
};

const workTicketOperateType = {
    //创建工单
    CREATE: 0,
    //派工
    ASSIGN_WORK_TYPE: 1,
    //快速解决
    FAST_SOLVE_TYPE: 2,
    //工单受理
    ACCEPT_SERVICE_TYPE: 3,
    //工单解决
    SOLVE_TYPE: 4,
    //添加陪同单
    ADD_ACCOMPANY_TYPE: 5,
    //申请退回
    APPLY_BACK_TYPE: 6,
    //拒绝退回
    REFUSE_BACK_TYPE: 7,
    //确认退回
    CONFIRM_BACK_TYPE: 8,
    //工单升级
    UPGRADE_TYPE: 9,
    //申请升级
    APPLY_UPGRADE_TYPE: 10,
    //拒绝升级
    REFUSE_UPGRADE_TYPE: 11,
    //确认升级
    CONFIRM_UPGRADE_TYPE: 12,
    //发起变更
    START_CHANGE_TYPE: 13,
    //工单挂起
    HANG_UP_TYPE: 14,
    //申请挂起
    APPLY_HANG_UP_TYPE: 15,
    //拒绝挂起
    REFUSE_HANG_UP_TYPE: 16,
    //确认挂起
    CONFIRM_HANG_UP_TYPE: 17,
    //解除挂起
    RELEASE_HANG_UP_TYPE: 18,
    //工单转派
    DISPATCH_TYPE: 19,
    //申请转派
    APPLY_DISPATCH_TYPE: 20,
    //拒绝转派
    REFUSE_DISPATCH_TYPE: 21,
    //确认转派
    CONFIRM_DISPATCH_TYPE: 22,
    //故障申报
    BACK_TYPE: 23,
    //退回
    WORK_BACK_TYPE: 24,
    //评价
    EVALUATE_TYPE: 25,
    //终止流程
    SOP_FLOW_TYPE: 26,
    //取消
    CANCEL_TYPE: 27
};

export default {
    data() {
        return {
            serviceOperateType: serviceOperateType,
            workTicketOperateType: workTicketOperateType
        };
    }
}