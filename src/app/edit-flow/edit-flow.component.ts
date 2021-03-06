import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {Flow} from '../core/domain/flow';
import {AppGlobalField} from '../core/app-global-field';
import {Plugin} from '../core/domain/plugin';
import {PluginsResponse} from '../core/domain/response/plugins-response';
import {FlowService} from '../core/service/flow.service';
import {ExceptionService} from '../core/service/exception.service';
import {CommonService} from '../core/service/common.service';
import {DeleteFlowRequest} from '../core/domain/request/delete-flow-request';
import {CommonOkResponse} from '../core/domain/response/common-ok-response';
import {GithubAccountResponse} from '../core/domain/response/github-account-response';

@Component({
  selector: 'app-edit-flow',
  templateUrl: './edit-flow.component.html',
  styleUrls: ['./edit-flow.component.css']
})
export class EditFlowComponent implements OnInit, AfterViewInit {

  showMessage: string;
  editingMessage: string;
  deletingMessage: string;
  isShowSystemAllPlugins: boolean;
  pluginsResponse: PluginsResponse;
  githubAccountResponse: GithubAccountResponse;

  flow: Flow;
  currentRepoBranches: string[];
  currentPlugins: Plugin[] = [];
  currentTriggerPush: string[] = [];
  needEnv: string[] = [];

  plugins: string[] = [];

  constructor(private route: ActivatedRoute,
              private flowService: FlowService,
              private exceptionService: ExceptionService,
              private location: Location,
              private elementRef: ElementRef,
              private commonService: CommonService) {
  }

  ngOnInit() {
    // 获取 EasyCI 的 Plugin 列表
    this.flowService.getPlugins()
      .subscribe(result => this.handleGetPlugins(result));

    // 判断是否已经获得 Github 授权，并标记
    if (localStorage.getItem(AppGlobalField.githubAccountResponse) != null) {
      this.githubAccountResponse = JSON.parse(localStorage.getItem(AppGlobalField.githubAccountResponse));
    }

    // 解析当前 Flow 对象，初始化一些数据
    this.initCurrentFlow();
    this.initCurrentRepoBranches();
    this.initCurrentTriggerPush();
  }

  ngAfterViewInit() {
    this.initCurrentCheckedTriggerPush();
    setTimeout(() => this.initCurrentExistPluginEnv(), 1000);
  }

  /**
   * 编辑 Flow
   */
  editFlow(): void {
    this.editingMessage = null;

    // Plugin[] 转换 string[]
    this.plugins = [];
    for (const plugin of this.currentPlugins) {
      this.plugins.push(plugin.scriptName);
    }
    this.editingMessage = '保存中……';

    const flow: Flow = new Flow(
      this.flow.id,
      this.flow.name,
      this.flow.userEmail,
      this.flow.repoOrigin,
      this.flow.repoId,
      this.flow.hookId,
      this.flow.platform,
      this.flow.version,
      this.currentTriggerPush,
      this.plugins,
      this.needEnv
    );
    this.flowService.edit(flow)
      .subscribe(result => this.handleEditFlow(result));
  }

  /**
   * 处理编辑 Flow
   * @param {Flow} flow
   */
  private handleEditFlow(flow: Flow): void {
    if (flow.id != null) {
      this.editingMessage = '保存成功！';
      setTimeout(() => this.jumpTo('/flow/' + flow.name), 1000);
    } else if (flow.error != null) {
      this.showMessage = '【编辑 Flow 遇到错误】' + flow.message;
    } else {
      this.exceptionService.handleError(flow);
    }
  }

  /**
   * 删除当前 Flow
   */
  deleteFlow(): void {
    this.deletingMessage = '真的要删除当前 Flow 吗？';
  }

  /**
   * 确认删除当前 Flow
   */
  confirmDelete(): void {
    this.deletingMessage = '【 Flow 删除中…… 】 此过程较慢，请耐心等待 O(∩_∩)O';

    const deleteFlowRequest: DeleteFlowRequest = new DeleteFlowRequest(
      this.flow.id,
      this.flow.hookId,
      this.flow.repoId
    );
    this.flowService.delete(deleteFlowRequest)
      .subscribe(result => this.handleConfirmDelete(result));
  }

  /**
   * 处理确认删除 Flow
   * @param {CommonOkResponse} commonOkResponse
   */
  private handleConfirmDelete(commonOkResponse: CommonOkResponse): void {
    if (commonOkResponse.code != null) {
      this.deletingMessage = '【 删除成功！ 】';
      setTimeout(() => this.jumpTo('/dashboard'), 1000);
    } else if (commonOkResponse.error != null) {
      this.deletingMessage = '【删除 Flow 遇到错误】' + commonOkResponse.message;
    } else {
      this.exceptionService.handleError(commonOkResponse);
    }
  }

  /**
   * 取消删除当前 Flow
   */
  cancelDelete(): void {
    this.deletingMessage = null;
  }

  /**
   * 处理从服务器获得的 Plugin 列表数据
   * @param {Plugin[]} plugins
   */
  private handleGetPlugins(pluginsResponse: PluginsResponse): void {
    if (pluginsResponse.plugins != null) {
      this.pluginsResponse = pluginsResponse;
      localStorage.setItem(AppGlobalField.pluginsResponse, JSON.stringify(pluginsResponse));
      this.initCurrentPlugins();
    } else if (pluginsResponse.error != null) {
      this.showMessage = '【系统支持插件列表】获取失败！ ' + pluginsResponse.message;
    } else {
      this.exceptionService.handleError(pluginsResponse);
    }
  }

  /**
   * 通过路由中的 flowId 得到当前选中的 Flow 信息
   */
  private initCurrentFlow(): void {
    const flowName: string = this.route.snapshot.paramMap.get('flowName');
    for (const tempFlow of JSON.parse(localStorage.getItem(AppGlobalField.flows))) {
      if (tempFlow.name === flowName) {
        this.flow = tempFlow;
        break;
      }
    }
  }

  /**
   * 获取当前 Flow 的仓库所包含的分支列表
   */
  private initCurrentRepoBranches(): void {
    if (localStorage.getItem(AppGlobalField.githubAccountResponse) != null) {
      for (const repo of JSON.parse(localStorage.getItem(AppGlobalField.githubAccountResponse)).githubRepos) {
        if (repo.id === this.flow.repoId) {
          this.currentRepoBranches = repo.branchs;
          break;
        }
      }
    }
  }

  /**
   * 获取当前 Flow 包含的插件
   */
  private initCurrentPlugins(): void {
    for (const tempStrPlugin of this.flow.plugins) {
      for (const tempObjectPlugin of this.pluginsResponse.plugins) {
        if (tempObjectPlugin.scriptName === tempStrPlugin) {
          this.currentPlugins.push(tempObjectPlugin);
        }
      }
    }
  }

  /**
   * 获取当前 Flow 配置的触发分支
   */
  private initCurrentTriggerPush(): void {
    for (const tempPushBranch of this.flow.triggerPush) {
      this.currentTriggerPush.push(tempPushBranch);
    }
  }

  /**
   * 初始化当前选中的 TriggerPush
   */
  private initCurrentCheckedTriggerPush(): void {
    if (localStorage.getItem(AppGlobalField.githubAccountResponse) != null) {
      for (const branch of this.currentRepoBranches) {
        for (const tempBranch of this.currentTriggerPush) {
          if (branch === tempBranch) {
            const tempElements = this.elementRef.nativeElement.querySelectorAll('input');
            for (const currentElement of tempElements) {
              if (currentElement.id === branch) {
                currentElement.checked = true;
              }
            }
          }
        }
      }
    }
  }

  /**
   * 初始化当前 Flow 的存在的环境变量
   */
  private initCurrentExistPluginEnv(): void {
    this.needEnv = this.flow.needEnv;
    for (const env of this.flow.needEnv) {
      const tempElements = this.elementRef.nativeElement.querySelectorAll('input');
      for (const currentElement of tempElements) {
        if (currentElement.id === env.split('===')[0]) {
          currentElement.value = env.split('===')[1];
        }
      }
    }
  }

  /**
   * 在 Flow 末尾添加一个插件
   * @param {Plugin} plugin
   */
  addOneOnCurrentPlugins(plugin: Plugin): void {
    if (this.currentPlugins.indexOf(plugin) === -1) {
      this.currentPlugins.push(plugin);
    }
  }

  /**
   * 移除已选插件中指定的项
   * @param {Plugin} plugin
   */
  removeOneOnCurrentPlugins(plugin: Plugin): void {
    const index: number = this.currentPlugins.indexOf(plugin);
    const frontPlugins: Plugin[] = this.currentPlugins.slice(0, index);
    const backPlugins: Plugin[] = this.currentPlugins.slice(index + 1, this.currentPlugins.length);
    this.currentPlugins = frontPlugins.concat(backPlugins);
  }

  /**
   * 处理已选择的出发分支
   * @param {boolean} checked
   * @param {string} branch
   */
  updateCheckedBranch(checked: boolean, branch: string): void {
    if (checked) {
      this.currentTriggerPush.push(branch);
    } else {
      const index: number = this.currentTriggerPush.indexOf(branch);
      const frontBranches: string[] = this.currentTriggerPush.slice(0, index);
      const backBranches: string[] = this.currentTriggerPush.slice(index + 1, this.currentTriggerPush.length);
      this.currentTriggerPush = frontBranches.concat(backBranches);
    }
  }

  /**
   * 处理插件环境变量输入内容
   * @param {string} envName
   * @param {string} envValue
   */
  updatePluginEnv(envName: string, envValue: string): void {
    for (const tempPluginEnv of this.needEnv) {
      if (tempPluginEnv.split('===')[0] === envName) {
        const index: number = this.needEnv.indexOf(tempPluginEnv);
        const frontPluginEnv: string[] = this.needEnv.slice(0, index);
        const backPluginEnv: string[] = this.needEnv.slice(index + 1, this.needEnv.length);
        this.needEnv = frontPluginEnv.concat(backPluginEnv);
        break;
      }
    }
    const pluginEnv: string = envName + '===' + envValue;
    this.needEnv.push(pluginEnv);
  }

  /**
   * 查找系统当前支持的所有插件
   */
  showSystemAllPlugins(): void {
    this.isShowSystemAllPlugins = true;
  }

  goBack(): void {
    this.location.back();
  }

  private jumpTo(url: string): void {
    this.commonService.jumpTo(url);
  }
}
