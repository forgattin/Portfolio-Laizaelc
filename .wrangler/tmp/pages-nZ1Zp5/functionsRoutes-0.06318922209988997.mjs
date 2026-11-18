import { onRequestGet as __api_admin_content_js_onRequestGet } from "/home/user/Portfolio-Laizaelc/functions/api/admin/content.js"
import { onRequestPut as __api_admin_content_js_onRequestPut } from "/home/user/Portfolio-Laizaelc/functions/api/admin/content.js"
import { onRequestPost as __api_admin_upload_js_onRequestPost } from "/home/user/Portfolio-Laizaelc/functions/api/admin/upload.js"
import { onRequestGet as __api_admin_youtube_js_onRequestGet } from "/home/user/Portfolio-Laizaelc/functions/api/admin/youtube.js"
import { onRequestGet as __api_img__id__js_onRequestGet } from "/home/user/Portfolio-Laizaelc/functions/api/img/[id].js"
import { onRequestGet as __api_content_js_onRequestGet } from "/home/user/Portfolio-Laizaelc/functions/api/content.js"
import { onRequestPost as __api_login_js_onRequestPost } from "/home/user/Portfolio-Laizaelc/functions/api/login.js"
import { onRequestPost as __api_logout_js_onRequestPost } from "/home/user/Portfolio-Laizaelc/functions/api/logout.js"
import { onRequestGet as __api_session_js_onRequestGet } from "/home/user/Portfolio-Laizaelc/functions/api/session.js"
import { onRequest as __api_admin__middleware_js_onRequest } from "/home/user/Portfolio-Laizaelc/functions/api/admin/_middleware.js"

export const routes = [
    {
      routePath: "/api/admin/content",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_content_js_onRequestGet],
    },
  {
      routePath: "/api/admin/content",
      mountPath: "/api/admin",
      method: "PUT",
      middlewares: [],
      modules: [__api_admin_content_js_onRequestPut],
    },
  {
      routePath: "/api/admin/upload",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_upload_js_onRequestPost],
    },
  {
      routePath: "/api/admin/youtube",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_youtube_js_onRequestGet],
    },
  {
      routePath: "/api/img/:id",
      mountPath: "/api/img",
      method: "GET",
      middlewares: [],
      modules: [__api_img__id__js_onRequestGet],
    },
  {
      routePath: "/api/content",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_content_js_onRequestGet],
    },
  {
      routePath: "/api/login",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_login_js_onRequestPost],
    },
  {
      routePath: "/api/logout",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_logout_js_onRequestPost],
    },
  {
      routePath: "/api/session",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_session_js_onRequestGet],
    },
  {
      routePath: "/api/admin",
      mountPath: "/api/admin",
      method: "",
      middlewares: [__api_admin__middleware_js_onRequest],
      modules: [],
    },
  ]