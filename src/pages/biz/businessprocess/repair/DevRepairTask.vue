<template>
    <ice-dialog title="任务维修单"
                :visible.sync="dialogEditVisible"
                :buttons="buttons"
                width="70%" :close-on-click-modal="false" :before-close="closeItem">
        <div class="form-content" style="max-height: 500px;overflow-y: scroll;overflow-x: hidden">
            <el-form :model="devRepairData" :rules="formRules" label-position="right"
                     class="conditon-bar" ref="PAGE_ENUM.REFS.FORM.REF"
                     style="margin-top: 20px">
                <ice-grid-layout  name="维修基本信息" :columns="2">
                    <el-form-item label="送修单位:" label-width="140px" prop="applyOrgName">
                        <div>
                            <el-input v-model="devRepairData.applyOrgName"></el-input>
                        </div>
                    </el-form-item>

                    <el-form-item label="送修人:" label-width="140px" prop="applyUserName">
                        <el-input v-model="devRepairData.applyUserName"></el-input>
                    </el-form-item>

                    <el-form-item label="送修类型:" label-width="140px" prop="applyType">
                        <!--<el-radio v-model="devRepairData.applyType" v-for="item in PAGE_ENUM.REPAIR_TYPE"-->
                                  <!--:label="item.CODE" >{{item.LABEL}}</el-radio>-->
                        <el-checkbox-group v-model="devRepairData.applyType" :max="1">
                            <el-checkbox v-for="column in PAGE_ENUM.REPAIR_TYPE" :label="column.CODE"

                                         :key="column.CODE">
                                {{column.LABEL}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="联系电话:" label-width="140px" prop="applyPhone">
                        <el-input v-model="devRepairData.applyPhone"></el-input>
                    </el-form-item>

                    <el-form-item label="送修部门:" label-width="140px" prop="applyDeptName">
                        <el-input v-model="devRepairData.applyDeptName"></el-input>
                    </el-form-item>

                    <el-form-item label="送修日期:" label-width="140px" prop="applyDate">
                        <el-date-picker
                                v-model="devRepairData.applyDate"
                                type="date"
                                placeholder="选择日期" format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>


                    <el-form-item label="维修模式:" label-width="140px" prop="repairMode" layout="2">
                        <el-radio v-model="devRepairData.repairMode" v-for="item in PAGE_ENUM.REPAIR_MODEL"
                                  :label="item.CODE" @change="repairModeChanged">{{item.LABEL}}</el-radio>
                    </el-form-item>

                    <el-form-item label="维修类别:" label-width="140px" prop="repairCategory" layout="2">
                        <el-checkbox-group v-model="devRepairData.repairCategory">
                            <el-checkbox v-for="column in PAGE_ENUM.REPAIR_CATEGORY" :label="column.CODE"
                                         style="width: 130px"
                                         :key="column.CODE">
                                {{column.LABEL}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="设备密级:" label-width="140px" prop="devSecretLevel" layout="2">
                        <el-radio v-model="devRepairData.devSecretLevel" v-for="item in PAGE_ENUM.REPAIR_SECRET_LEVEL"
                                  :label="item.CODE" >{{item.LABEL}}</el-radio>
                    </el-form-item>

                    <el-form-item label="送修单位保密审批手续:" label-width="180px" prop="privaryApprove" v-if="showPrivaryApprove">
                        <div>
                            <div style="float: left">
                                <el-radio v-model="devRepairData.privaryApprove" label="1">有</el-radio>
                                <el-radio v-model="devRepairData.privaryApprove" label="0">无</el-radio>
                            </div>
                            <div style="float:left;">
                                <label style="margin-right: 5px">是否与送修审批单一致并接收:</label>
                                <el-radio v-model="devRepairData.privaryApproveFit" label="1">是</el-radio>
                                <el-radio v-model="devRepairData.privaryApproveFit" label="0">否</el-radio>
                            </div>
                            <div style="float: left;">
                                <label style="margin-right: 2px">审批单号：</label>
                                <a>12333313212</a>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label="附件:" label-width="140px" prop="receiveDate">
                        <ice-multiple-upload v-model="devRepairData.approveFile"></ice-multiple-upload>
                    </el-form-item>

                    <el-form-item label="接件日期:" label-width="140px" prop="receiveDate">
                        <el-date-picker
                                v-model="devRepairData.receiveDate"
                                type="date"
                                placeholder="选择日期" format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="所内维修工程师:" label-width="140px" prop="repairmanInternelName">
                        <el-input v-model="devRepairData.repairmanInternelName"></el-input>
                    </el-form-item>

                    <el-form-item label="送修人是否已向您明确保密要求:" label-width="250px" prop="confirmPrivary" layout="2" v-if="showPrivaryApprove&&showInnerSelfRepair">
                        <el-radio v-model="devRepairData.confirmPrivary" label="1">是</el-radio>
                        <el-radio v-model="devRepairData.confirmPrivary" label="0">否</el-radio>
                    </el-form-item>

                    <el-form-item label="是否已告知维修人员保密要求:" label-width="250px" prop="informPrivary" layout="2" v-if="showPrivaryApprove&&showMainInnerRepair">
                        <el-radio v-model="devRepairData.informPrivary" label="1">是</el-radio>
                        <el-radio v-model="devRepairData.informPrivary" label="0">否</el-radio>
                    </el-form-item>

                    <el-form-item label="是否全程旁站陪同:" label-width="250px" prop="escort" layout="2" v-if="showPrivaryApprove&&showMainInnerRepair">
                        <el-radio v-model="devRepairData.escort" label="1">是</el-radio>
                        <el-radio v-model="devRepairData.escort" label="0">否</el-radio>
                    </el-form-item>

                    <el-form-item label="是否已拆除涉密存储硬件和固件:" label-width="250px" prop="removeSecretModule" layout="2" v-if="showPrivaryApprove&&showOutRepair">
                        <el-radio v-model="devRepairData.removeSecretModule" label="1">是</el-radio>
                        <el-radio v-model="devRepairData.removeSecretModule" label="0">否</el-radio>
                    </el-form-item>

                    <el-form-item label="维修完毕,是否完成保密检查:" label-width="250px" prop="privaryCheck" layout="2" v-if="showPrivaryApprove&&showOutRepair">
                        <el-radio v-model="devRepairData.privaryCheck" label="1">是</el-radio>
                        <el-radio v-model="devRepairData.privaryCheck" label="0">否</el-radio>
                    </el-form-item>

                    <el-form-item label="质保单位名称:" label-width="140px" prop="qualityEnsureDeptName" layout="2" v-if="showMainInnerRepair">
                        <el-input v-model="devRepairData.qualityEnsureDeptName"></el-input>
                    </el-form-item>

                    <el-form-item label="质保单位维修人员姓名:" label-width="160px" prop="qualityEnsureRepairman" v-if="showMainInnerRepair">
                        <el-input v-model="devRepairData.qualityEnsureRepairman"></el-input>
                    </el-form-item>

                    <el-form-item label="质保单位维修人员联系方式:" label-width="200px" prop="qualityEnsureRepairmanPhone" v-if="showMainInnerRepair">
                        <el-input v-model="devRepairData.qualityEnsureRepairmanPhone"></el-input>
                    </el-form-item>

                    <el-form-item label="送外维修单位:" label-width="140px" prop="externalRepairDeptName" layout="2" v-if="showOutRepair">
                        <el-input v-model="devRepairData.externalRepairDeptName"></el-input>
                    </el-form-item>

                    <el-form-item label="送外单位维修人员姓名:" label-width="160px" prop="externalRepairMan" v-if="showOutRepair">
                        <el-input v-model="devRepairData.externalRepairMan"></el-input>
                    </el-form-item>

                    <el-form-item label="送外单位维修人员联系方式:" label-width="200px" prop="externalRepairManPhone" v-if="showOutRepair">
                        <el-input v-model="devRepairData.externalRepairManPhone"></el-input>
                    </el-form-item>

                </ice-grid-layout>
                <ice-grid-layout  name="硬件维修" :columns="2">
                    <el-form-item label="设备类别:" label-width="140px" prop="hwCategory" layout="2">
                        <!--<el-radio v-model="devRepairData.category" v-for="item in PAGE_ENUM.DEV_CATEGORY"-->
                        <!--:label="item.CODE">{{item.LABEL}}</el-radio>-->

                        <el-checkbox-group v-model="devRepairData.hwCategory" :max="1">
                            <el-checkbox v-for="column in PAGE_ENUM.DEV_CATEGORY" :label="column.CODE"
                                         :key="column.CODE">
                                {{column.LABEL}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="故障现象:" label-width="140px" prop="fault" layout="2">
                        <el-input placeholder="备注" type="textarea" :rows="2"
                                  v-model="devRepairData.fault"></el-input>
                    </el-form-item>

                    <el-form-item label="故障诊断情况:" label-width="140px" prop="faultDiagnosis">
                        <el-input placeholder="备注" type="textarea" :rows="2"
                                  v-model="devRepairData.faultDiagnosis"></el-input>
                    </el-form-item>

                    <el-form-item label="完成日期:" label-width="140px" prop="faultDiagnosisDate">
                        <el-date-picker
                                v-model="devRepairData.faultDiagnosisDate"
                                type="date"
                                placeholder="选择日期" format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="是否更换存储设备:" label-width="140px" prop="changeStoreDev" layout="2">
                        <el-radio v-model="devRepairData.changeStoreDev" label="1">是</el-radio>
                        <el-radio v-model="devRepairData.changeStoreDev" label="0">否</el-radio>
                    </el-form-item>

                    <el-form-item label="维修工时:" label-width="140px" prop="repairSpendTime">
                        <div style="width: 100%">
                            <div style="float: left;width: 85%">
                                <el-input-number v-model="devRepairData.repairSpendTime"
                                                 controls-position="right"
                                                 :min="0"
                                                 :step="0.5"
                                                 :precision="1"
                                                 @change="calcRepairMoney">
                                </el-input-number>
                            </div>
                            <div style="float: left;width: 15%">
                                <span>小时</span>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label="收费标准(每小时):" label-width="140px" prop="priceStandard">
                        <div style="width: 100%">
                            <div style="float: left;width: 85%">
                                <el-select v-model="devRepairData.priceStandard" @change="calcRepairMoney">
                                    <el-option
                                            v-for="item in repairPriceStandard"
                                            :key="item.code"
                                            :label="item.name"
                                            :value="item.name">
                                    </el-option>
                                </el-select>
                            </div>
                            <div style="float: right;width: 15%">
                                <el-button type="info"
                                           icon="el-icon-search"
                                           @click="repairPriceReference"
                                           style="float:right" plain>
                                </el-button>
                            </div>
                        </div>
                    </el-form-item>
                </ice-grid-layout>
                <ice-grid-layout  name="数据恢复" :columns="2">

                    <el-form-item label="设备类别:" label-width="140px" prop="dataCategory" layout="2">
                        <!--<el-radio v-model="devRepairData.dataCategory" v-for="item in PAGE_ENUM.DATA_CATEGORY"-->
                                  <!--:label="item.CODE">{{item.LABEL}}</el-radio>-->
                        <el-checkbox-group v-model="devRepairData.dataCategory" :max="1">
                            <el-checkbox v-for="column in PAGE_ENUM.DATA_CATEGORY" :label="column.CODE"
                                         :key="column.CODE">
                                {{column.LABEL}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="预计恢复量:" label-width="140px" prop="recoverCapacityExpect">
                        <div>
                            <div style="float: left;width: 95%">
                                <el-input v-model="devRepairData.recoverCapacityExpect"></el-input>
                            </div>
                            <div style="float: left;width: 5%">
                                <span>G</span>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label="实际恢复量:" label-width="140px" prop="recoverCapacityActual">
                        <div>
                            <div style="float: left;width: 95%">
                                <el-input v-model="devRepairData.recoverCapacityActual"></el-input>
                            </div>
                            <div style="float: left;width: 5%">
                                <span>G</span>
                            </div>
                        </div>
                    </el-form-item>

                </ice-grid-layout>
                <ice-grid-layout  name="数据粉碎(介质消磁/信息消除)" :columns="2">

                    <el-form-item label="数据量:" label-width="140px" prop="deleteDataCapacity">
                        <div>
                            <div style="float: left;width: 95%">
                                <el-input v-model="devRepairData.deleteDataCapacity"></el-input>
                            </div>
                            <div style="float: left;width: 5%">
                                <span>G</span>
                            </div>
                        </div>
                    </el-form-item>

                </ice-grid-layout>

                <ice-grid-layout  name="费用结算" :columns="1">

                    <el-form-item label="" label-width="10px" prop="deleteDataCapacity">

                        <el-table
                                :data="editTables"
                                :span-method="arraySpanMethod"
                                border
                                :show-header="false"
                                style="width: 100%">
                            <el-table-column
                                    prop="name"
                                    label="ID"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="costOption"
                                    label="姓名">
                                <template slot-scope="scope">
                                    <span style="margin-left: 10px" v-if="scope.$index != 15 && scope.$index !== 16">{{ scope.row.costOption }}</span>
                                    <div v-if="scope.$index === 15">
                                        <el-checkbox v-model="isConfirmAndReceiveDev">确认维修结果并接收设备</el-checkbox>
                                    </div>
                                    <el-input v-if="scope.$index === 16" v-model="devRepairData.remark" type="textarea" :rows="2"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="shouldCost"
                                    label="数值 1">

                                <template slot-scope="scope">
                                    <div v-if="scope.$index === 1" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costHardwarePhenExpect" @change="calcShouldPrice"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 2" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costHardwareRepairExpect" @change="calcShouldPrice"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 3" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costRepairMaterialExpect" @change="calcShouldPrice"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 4" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costRepairMaterialMExpect" @change="calcShouldPrice"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 5" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costTravelExpect" @change="calcShouldPrice"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 6" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costDataBaseExpect" @change="calcShouldPrice"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 7" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costDataDiskExpect" @change="calcShouldPrice"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 8" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costDataArrayExpect" @change="calcShouldPrice"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 9" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costDataRecoverExpect" @change="calcShouldPrice"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 10" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costMsgDeleteExpect" @change="calcShouldPrice"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 11" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costMediumDeleteExpect" @change="calcShouldPrice"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 12" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costTotalExpect" :disabled="true" ></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <el-input v-if="scope.$index === 14" v-model="devRepairData.remark" type="textarea" :rows="2"></el-input>
                                    <span style="margin-left: 10px" v-if="scope.$index === 15">{{ scope.row.shouldCost }}</span>
                                    <span style="margin-left: 10px" v-if="scope.$index === 0">{{ scope.row.shouldCost }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="realityCost"
                                    label="数值 2">
                                <template slot-scope="scope">
                                    <div v-if="scope.$index === 1" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costHardwarePhenActual"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 2" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costHardwareRepairActual"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 3" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costRepairMaterialActual"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 4" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costRepairMaterialMActual"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 5" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costTravelActual"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 6" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costDataBaseActual"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 7" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-if="scope.$index === 7" v-model="devRepairData.costDataDiskActual"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 8" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costDataArrayActual"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 9" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costDataRecoverActual"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 10" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costMsgDeleteActual"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 11" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costMediumDeleteActual"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 12" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.costTotalActual"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <div v-if="scope.$index === 13" style="width: 100%">
                                        <div style="float: left;width: 95%">
                                            <el-input v-model="devRepairData.profit"></el-input>
                                        </div>
                                        <div style="float: left;width: 5%">
                                            <span>元</span>
                                        </div>
                                    </div>

                                    <span style="margin-left: 10px" v-if="scope.$index === 0">{{ scope.row.realityCost }}</span>

                                    <el-date-picker
                                            v-model="devRepairData.backDate"
                                            type="date"
                                            placeholder="选择日期" format="yyyy-MM-dd" v-if="scope.$index === 15">
                                    </el-date-picker>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </ice-grid-layout>
            </el-form>
        </div>
        <dev-repair-price-by-hw ref="repairPrice" v-if="showPrice"></dev-repair-price-by-hw>
    </ice-dialog>
</template>

<script>
    // import common from '@/utils/common.js';
    import IceSelect from "@/components/common/base/IceSelect";
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceTree from '@/components/common/base/IceTree.vue'
    import IceDialog from "@/components/common/base/IceDialog";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceImageUploader from "@/components/common/base/IceImageUpload";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    import devComm from "../../dev/js/comm/devComm"
    import DevRepairPriceByHw from "./DevRepairPriceByHw";

    export default {
        name: "devRepairTask",
        components: {
            DevRepairPriceByHw,
            IceMultipleUpload,
            IceSelect,
            IceGridLayout,
            IceTree,
            IceDialog,
            IceEditableTableColumn,
            IceEditableTable,
            IceImageUploader
        },
        props: {
            devRepairObject:{
                type: Object
            },
            saveRepairFrom: {//绑定数据前对数据处理
                type: Function,
                default: data => data
            }
        },
        mixins: [devComm],
        data(){
            return{
                PAGE_ENUM:{
                    REFS:{
                        FORM:{REF:"form"}

                    },
                    REPAIR_TYPE:[
                        {CODE:'0',LABEL:'所内'},
                        {CODE:'1',LABEL:'委托运维单位'},
                        {CODE:'2',LABEL:'非委托运维单位'},
                        {CODE:'3',LABEL:'院外单位'},
                    ],
                    REPAIR_CATEGORY:[
                        {CODE:'1',LABEL:'硬件维修'},
                        {CODE:'2',LABEL:'数据恢复'},
                        {CODE:'3',LABEL:'介质消磁'},
                        {CODE:'4',LABEL:'信息消除'}
                    ],
                    REPAIR_MODEL:[
                        {CODE:'1',LABEL:'所内自行维修'},
                        {CODE:'2',LABEL:'质保单位所内维修'},
                        {CODE:'3',LABEL:'送外维修'},
                    ],
                    REPAIR_SECRET_LEVEL:[
                        // 密级,1：未定密；2：公开；3：内部；4：机密；5：绝密
                        // {CODE:6,LABEL:'未定密'},
                        {CODE:1,LABEL:'公开'},
                        {CODE:2,LABEL:'内部'},
                        {CODE:3,LABEL:'秘密'},
                        {CODE:4,LABEL:'机密'},
                        {CODE:5,LABEL:'绝密'},
                        {CODE:6,LABEL:'未定密'}
                    ],
                    DEV_CATEGORY:[//设备维修类别
                        {CODE:'1',LABEL:'台式PC'},
                        {CODE:'2',LABEL:'笔记本'},
                        {CODE:'3',LABEL:'工控机'},
                        {CODE:'4',LABEL:'服务器(含工作站)'},
                        {CODE:'5',LABEL:'计算机外设'}
                    ],
                    DATA_CATEGORY:[//数据恢复类别
                        {CODE:'1',LABEL:'普通存储介质'},
                        {CODE:'2',LABEL:'服务器存储介质'},
                        {CODE:'3',LABEL:'磁盘阵列'}
                    ],
                },
                dialogEditVisible:false,
                buttons:[
                    {name: '返回', iscannel: true},
                    {name: '确认', iscannel: false,click: this.saveBatchData}
                ],
                formRules: {
                    // devName: {required: true, message: '请选择需要维修的设备', trigger: 'change'},
                    // faultPhenomenon: {required: true, message: '请输入设备故障现象', trigger: 'blur'},//故障现象描述

                },
                devRepairData:{
                    applyType:[],
                    devSecretLevel:1,
                    hwCategory:[],
                    repairCategory:[],
                    dataCategory:[],
                    repairSpendTime:1.0,
                    priceStandard:''
                },
                editTables:[
                    {name:'设备维修',costOption:'费用',shouldCost:'应收',realityCost:'实收'},
                    {name:'设备维修',costOption:'硬件故障诊断',shouldCost:'',realityCost:''},
                    {name:'设备维修',costOption:'硬件故障维修',shouldCost:'',realityCost:''},
                    {name:'设备维修',costOption:'维修材料费',shouldCost:'',realityCost:''},
                    {name:'设备维修',costOption:'维修材料管理费',shouldCost:'',realityCost:''},
                    {name:'设备维修',costOption:'差旅费',shouldCost:'',realityCost:''},


                    {name:'数据恢复',costOption:'基本费',shouldCost:'',realityCost:''},
                    {name:'数据恢复',costOption:'开盘费',shouldCost:'',realityCost:''},
                    {name:'数据恢复',costOption:'阵列组合修复费',shouldCost:'',realityCost:''},
                    {name:'数据恢复',costOption:'恢复费',shouldCost:'',realityCost:''},

                    {name:'数据粉碎',costOption:'信息消除费用',shouldCost:'',realityCost:''},
                    {name:'数据粉碎',costOption:'介质消除费用',shouldCost:'',realityCost:''},

                    {name:'合计',costOption:'',shouldCost:'',realityCost:''},

                    {name:'总利润',costOption:'',shouldCost:'',realityCost:''},

                    {name:'费用说明',costOption:'',shouldCost:'',realityCost:''},

                    {name:'用户签字',costOption:'',shouldCost:'取件日期',realityCost:''},

                    {name:'备注',costOption:'',shouldCost:'',realityCost:''}

                ],
                showPrivaryApprove:false,//是否展示送修单位保密审批手续
                showInnerSelfRepair:false,//所内自行维修填写项展示
                showMainInnerRepair:false,//质保单位所内维修填写项展示
                showOutRepair:false,//送外维修填写项展示
                isConfirmAndReceiveDev:false,//确认并接收设备标识
                repairPriceStandard:[],//维修收费标准
                showPrice:false,
            }
        },
        methods:{
            opendialog(){
                console.log(this.devRepairObject)
                Object.assign(this.devRepairData, this.devRepairObject);
                console.log(this.devRepairData)
                if(this.devRepairData.confirmReceiveDev == 1){
                    this.isConfirmAndReceiveDev = true
                }else{
                    this.isConfirmAndReceiveDev = false
                }

                if(this.devRepairData.devSecretLevel>1){//非公开密级
                    this.showPrivaryApprove = true
                }else{
                    this.showPrivaryApprove = false
                }

                this.dialogEditVisible = true;
            },
            saveBatchData(){
                if(this.isConfirmAndReceiveDev){
                    this.devRepairData.confirmReceiveDev = 1
                }else{
                    this.devRepairData.confirmReceiveDev = 0
                }
                this.saveRepairFrom(this.devRepairData)
                this.dialogEditVisible = false
            },
            /**
             * 初始化表格列
             */
            initColumns() {
                this.columns = [
                    // {
                    //     label: '软件图标', code: 'softIconId', width: 100, renderCell(h, data) {
                    //         return <img src={this.$showImage(data.row.softIconId)} width="22px" height="22px"/>
                    //     }
                    // },
                    // {code: 'devId', hidden: true},
                    // {
                    //     label: '设备类型', code: 'category', width: 120, renderCell(h, data) {
                    //         return _this.onCategoryRenderer(data.row.category);
                    //     }
                    // },
                    // {
                    //     label: '设备子类', code: 'childType', width: 120, renderCell(h, data) {
                    //         return _this.onChildTypeRenderer(data.row.childType);
                    //     }
                    // },
                    // {label: '设备名称', code: 'name', width: 150},
                    // {
                    //     label: '密级', code: 'secretLevel', width: 100, renderCell(h, data) {
                    //         return _this.getNameByCode(_this.ENUMS.DATA_SECRET_LEVEL_DATA, data.row.secretLevel);
                    //     }
                    // },
                    // {label: '保密编号', code: 'secretSn', width: 150},
                    // {label: '容量', code: 'secretSn', width: 150},
                    // {label: '备注', code: 'secretSn', width: 150},
                    // {label: '序列号', code: 'licenseType', width: 120}
                ]
            },
            initControls(){
                this.initColumns();
                this.initRepairPrice();

            },
            initRepairPrice(){
                this.ENUMS.DEV_REPAIR_PRICE_REF_DATA.forEach(item =>{
                    let temp = {}
                    if(item.code == 'INTERNAL_COMPANY'){
                        temp.code = 'internal'
                        temp.name = item.name
                        this.repairPriceStandard.push(temp)
                    }else if(item.code == 'EXTERNAL_COMPANY'){
                        temp.code = 'external'
                        temp.name = item.name
                        this.repairPriceStandard.push(temp)
                    }
                })
            },
            closeItem(){
                this.dialogEditVisible = false
            },
            /**
             * 合并单元格
             * 参数：当前行row、当前列column、当前行号rowIndex、当前列号columnIndex四个属性
             * 返回值：[a,b] a为rowspan,b为colspan
             *
             */
            arraySpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    if(rowIndex === 0){
                        return [6,1]
                    }else if(rowIndex === 6){
                        return [4,1]
                    }else if(rowIndex === 10){
                        return [2,1]
                    }else if(rowIndex === 12){
                        return [1,2]
                    }else if(rowIndex === 13){
                        return [1,2]
                    }else if(rowIndex === 14){
                        return [1,2]
                    }else if(rowIndex === 15){
                        return [1,1]
                    }else if(rowIndex === 16){
                        return [1,1]
                    }else{
                        return [0,0]
                    }
                }else if(columnIndex === 1){
                    if(rowIndex === 12){
                        return [0,0]
                    }else if(rowIndex === 13){
                        return [0,0]
                    }else if(rowIndex === 14){
                        return [0,0]
                    }else if(rowIndex === 16){
                        return [1,3]
                    }
                }else if(columnIndex === 2){
                    if(rowIndex === 14){
                        return [1,2]
                    }
                }else{
                    if(rowIndex === 14 || rowIndex === 16){
                        return [0,0]
                    }
                }
            },
            calcShouldPrice(){//计算应收费用汇总值
                let arr = [];
                Object.assign(arr,this.editTables);

                let sumCloumn=[
                    this.devRepairData.costHardwarePhenExpect,
                    this.devRepairData.costHardwareRepairExpect,
                    this.devRepairData.costRepairMaterialExpect,
                    this.devRepairData.costRepairMaterialMExpect,
                    this.devRepairData.costTravelExpect,
                    this.devRepairData.costDataBaseExpect,
                    this.devRepairData.costDataDiskExpect,
                    this.devRepairData.costDataArrayExpect,
                    this.devRepairData.costDataRecoverExpect,
                    this.devRepairData.costMsgDeleteExpect,
                    this.devRepairData.costMediumDeleteExpect
                ]
                let sum =0;
                sumCloumn.forEach(item => {

                    if (!isNaN(Number(item))) {
                        return sum += Number(item);
                    } else {
                        return ;
                    }
                })

                this.devRepairData.costTotalExpect = sum;
                this.editTables = arr;
            },
            repairModeChanged(){
                console.log(this.devRepairData.repairMode)
                if(this.devRepairData.repairMode === '1'){//所内自行维修
                    this.showInnerSelfRepair = true
                    this.showMainInnerRepair = false
                    this.showOutRepair = false
                }else if(this.devRepairData.repairMode === '2'){//质保单位所内维修
                    this.showInnerSelfRepair = false
                    this.showMainInnerRepair = true
                    this.showOutRepair = false
                }else {//送外维修
                    this.showInnerSelfRepair = false
                    this.showMainInnerRepair = false
                    this.showOutRepair = true
                }
            },
            calcRepairMoney(){
                if(this.devRepairData.repairSpendTime && this.devRepairData.priceStandard){
                    let arr = [];
                    Object.assign(arr,this.editTables);

                    this.devRepairData.costHardwareRepairExpect = Number(this.devRepairData.repairSpendTime)*Number(this.devRepairData.priceStandard.split('元')[0])

                    this.editTables = arr;
                    // debugger;
                }
            },
            repairPriceReference(){
                this.showPrice = true;
                this.$nextTick(() => {
                    this.$refs['repairPrice'].opendialog();
                });
            }
        },
        mounted() {
            // this.initColumns();
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DEV_REPAIR_PRICE_REFERENCE.CODE),
            ];
            Promise.all(prepareTaskChain).then(this.initControls);
        }
    }
</script>

<style scoped>
    a{
        color:blue;
        text-decoration:underline;
        cursor: pointer;
        margin-left: 10px;
    }
</style>