module.exports = [
  "GET /status",
  "POST /session",
  "GET /sessions",
  "GET /session/id",
  "DELETE /session/id",
  "POST /session/id/timeouts",
  "POST /session/id/timeouts/async_script",
  "POST /session/id/timeouts/implicit_wait",
  "GET /session/id/window_handle",
  "GET /session/id/window_handles",
  "GET /session/id/url",
  "POST /session/id/url",
  "POST /session/id/forward",
  "POST /session/id/back",
  "POST /session/id/refresh",
  "POST /session/id/execute",
  "POST /session/id/execute_async",
  "GET /session/id/screenshot",
  "GET /session/id/ime/available_engines",
  "GET /session/id/ime/active_engine",
  "GET /session/id/ime/activated",
  "POST /session/id/ime/deactivate",
  "POST /session/id/ime/activate",
  "POST /session/id/frame",
  "POST /session/id/window",
  "DELETE /session/id/window",
  "POST /session/id/window/handle/size",
  "GET /session/id/window/handle/size",
  "POST /session/id/window/handle/position",
  "GET /session/id/window/handle/position",
  "POST /session/id/window/handle/maximize",
  "GET /session/id/cookie",
  "POST /session/id/cookie",
  "DELETE /session/id/cookie",
  "DELETE /session/id/cookie/name",
  "GET /session/id/source",
  "GET /session/id/title",
  "POST /session/id/element",
  "POST /session/id/elements",
  "POST /session/id/element/active",
  "GET /session/id/element/id",
  "POST /session/id/element/id/element",
  "POST /session/id/element/id/elements",
  "POST /session/id/element/id/click",
  "POST /session/id/element/id/submit",
  "GET /session/id/element/id/text",
  "POST /session/id/element/id/value",
  "POST /session/id/keys",
  "GET /session/id/element/id/name",
  "POST /session/id/element/id/clear",
  "GET /session/id/element/id/selected",
  "GET /session/id/element/id/enabled",
  "GET /session/id/element/id/attribute/name",
  "GET /session/id/element/id/equals/other",
  "GET /session/id/element/id/displayed",
  "GET /session/id/element/id/location",
  "GET /session/id/element/id/location_in_view",
  "GET /session/id/element/id/size",
  "GET /session/id/element/id/css/property",
  "GET /session/id/orientation",
  "POST /session/id/orientation",
  "GET /session/id/alert_text",
  "POST /session/id/alert_text",
  "POST /session/id/accept_alert",
  "POST /session/id/dismiss_alert",
  "POST /session/id/moveto",
  "POST /session/id/click",
  "POST /session/id/buttondown",
  "POST /session/id/buttonup",
  "POST /session/id/doubleclick",
  /*
  "POST /session/id/touch/click",
  "POST /session/id/touch/down",
  "POST /session/id/touch/up",
  "POST session/id/touch/move",
  "POST session/id/touch/scroll",
  "POST session/id/touch/scroll",
  "POST session/id/touch/doubleclick",
  "POST session/id/touch/longclick",
  "POST session/id/touch/flick",
  "POST session/id/touch/flick",*/

  "GET /session/id/location",
  "POST /session/id/location",
  "GET /session/id/local_storage",
  "POST /session/id/local_storage",
  "DELETE /session/id/local_storage",
  "GET /session/id/local_storage/key/name",
  "DELETE /session/id/local_storage/key/name",
  "GET /session/id/local_storage/size",
  "GET /session/id/session_storage",
  "POST /session/id/session_storage",
  "DELETE /session/id/session_storage",
  "GET /session/id/session_storage/key/name",
  "DELETE /session/id/session_storage/key/name",
  "GET /session/id/session_storage/size",
  "POST /session/id/log",
  "GET /session/id/log/types",
  "GET /session/id/application_cache/status"
];