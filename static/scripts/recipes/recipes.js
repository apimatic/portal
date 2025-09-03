document.addEventListener("DOMContentLoaded", (event) => {
  APIMaticDevPortal.ready(async ({ registerWorkflow }) => {
    const { default: folderReminderWorkflow } = await import("./folder-reminder-workflow.js");
    registerWorkflow("page:recipes/folder-reminder-workflow", "Folder Reminder Workflow Recipe", folderReminderWorkflow);
  });
});