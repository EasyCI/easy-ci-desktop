export class AppBackEndApi {
  // Back End Host Address
  static backendHost = 'http://ci.laoliang.ink:8080';

  // RESTful API (user/*)
  static userRegisterUrl = AppBackEndApi.backendHost + '/user/register';
  static userLoginUrl = AppBackEndApi.backendHost + '/user/login';
  static userChangePasswordUrl = AppBackEndApi.backendHost + '/user/change_password';

  // RESTful API (repos/*)
  static reposGetGithubAuthUrl = AppBackEndApi.backendHost + '/repos/get_github_auth_url';
  static reposGetGithubAccount = AppBackEndApi.backendHost + '/repos/get_github_account';
  static reposUpdateGithubAccount = AppBackEndApi.backendHost + '/repos/update_github_account';

  // RESTful API (flow/*)
  static flowGetPlugins = AppBackEndApi.backendHost + '/flow/get_plugins';
  static flowCreate = AppBackEndApi.backendHost + '/flow/create';
  static flowEdit = AppBackEndApi.backendHost + '/flow/edit';
  static flowGetAll = AppBackEndApi.backendHost + '/flow/get_all';
  static flowDelete = AppBackEndApi.backendHost + '/flow/delete';

  // RESTful API (task/*)
  static taskTrigger = AppBackEndApi.backendHost + '/task/trigger';
  static taskUpToDate = AppBackEndApi.backendHost + '/task/up_to_date';

  // RESTful API (dashboard/*)
  static dashboardGetFlowDetails = AppBackEndApi.backendHost + '/dashboard/get_flow_details';
}
