$(function () {
    $("#jqGrid").Grid({
        url: '../sys/schedule/list',
        colModel: [
            {label: '任务ID', name: 'jobId', width: 60, key: true},
            {label: 'bean名称', name: 'beanName', width: 100},
            {label: '方法名称', name: 'methodName', width: 100},
            {label: '参数', name: 'params', width: 100},
            {label: 'cron表达式 ', name: 'cronExpression', width: 100},
            {label: '备注 ', name: 'remark', width: 100},
            {
                label: '状态', name: 'status', width: 60, formatter: function (value, options, row) {
                    return value === 0 ?
                        '<span class="label label-success">正常</span>' :
                        '<span class="label label-danger">暂停</span>';
                }
            }
        ]
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            beanName: null
        },
        showList: true,
        title: null,
        schedule: {},
        ruleValidate: {
            beanName: [
                {required: true, message: 'bean名称不能为空', trigger: 'blur'}
            ],
            methodName: [
                {required: true, message: '方法名称不能为空', trigger: 'blur'}
            ],
            cronExpression: [
                {required: true, message: 'cron表达式不能为空', trigger: 'blur'}
            ]
        }
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.schedule = {};
        },
        update: function () {
            var jobId = getSelectedRow("#jqGrid");
            if (jobId == null) {
                return;
            }

            $.get("../sys/schedule/info/" + jobId, function (r) {
                vm.showList = false;
                vm.title = "修改";
                vm.schedule = r.schedule;
            });
        },
        saveOrUpdate: function (event) {
            var url = vm.schedule.jobId == null ? "../sys/schedule/save" : "../sys/schedule/update";
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(vm.schedule),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        del: function (event) {
            var jobIds = getSelectedRows("#jqGrid");
            if (jobIds == null) {
                return;
            }

            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: "../sys/schedule/delete",
                    contentType: "application/json",
                    data: JSON.stringify(jobIds),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        pause: function (event) {
            var jobIds = getSelectedRows("#jqGrid");
            if (jobIds == null) {
                return;
            }

            confirm('确定要暂停选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: "../sys/schedule/pause",
                    contentType: "application/json",
                    data: JSON.stringify(jobIds),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        resume: function (event) {
            var jobIds = getSelectedRows("#jqGrid");
            if (jobIds == null) {
                return;
            }

            confirm('确定要恢复选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: "../sys/schedule/resume",
                    contentType: "application/json",
                    data: JSON.stringify(jobIds),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        runOnce: function (event) {
            var jobIds = getSelectedRows("#jqGrid");
            if (jobIds == null) {
                return;
            }

            confirm('确定要立即执行选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: "../sys/schedule/run",
                    contentType: "application/json",
                    data: JSON.stringify(jobIds),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        reload: function (event) {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                postData: {'beanName': vm.q.beanName},
                page: page
            }).trigger("reloadGrid");
        },
        handleSubmit: function (name) {
            handleSubmitValidate(this, name, function () {
                vm.saveOrUpdate()
            });
        },
        handleReset: function (name) {
            handleResetForm(this, name);
        }
    }
});