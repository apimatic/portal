export default function folderReminderWorkflow(workflowCtx, portal) {
  return {
    Overview: {
      name: "Overview",
      stepCallback: async () => {
        return workflowCtx.showContent(
          `# Folder Reminder Workflow

This recipe demonstrates how to create a new folder and then set an email reminder for it.  
You'll also see how to pass data (the new folder's UID) between API calls.

## Steps Covered

### 1. Create New Folder
Create a folder in the system.

### 2. Add an Email Reminder
Attach a reminder to the newly created folder using its UID.
`
        );
      },
    },
    "Step 1": {
      name: "Create New Folder",
      stepCallback: async (stepState) => {
        return workflowCtx.showEndpoint({
          description:
            "This endpoint creates a new folder. After a successful call, the `folderUid` from the response will be used in the next step to add a reminder.",
          endpointPermalink: "$e/Folder/createFolder",
          args: {
            body: {
              name: "New Folder for My Project",
            },
          },
          verify: (response, setError) => {
            if (response.StatusCode == 201) {
              return true;
            } else {
              setError("Failed to create folder. Please try again.");
              return false;
            }
          },
        });
      },
    },
    "Step 2": {
      name: "Add an Email Reminder",
      stepCallback: async (stepState) => {
        const createFolderStep = stepState?.["Step 1"];
        const folderUid = createFolderStep?.data?.folderUid;

        if (!folderUid) {
          return workflowCtx.showContent(`
### Error: Missing Folder UID
It looks like the previous step did not return a valid folder UID. Please make sure "Step 1" completed successfully before continuing.
          `);
        }

        return workflowCtx.showEndpoint({
          description:
            "Use the `folderUid` from the previous step to set a reminder on the newly created folder.",
          endpointPermalink: "$e/Reminder/addReminders",
          args: {
            body: [
              {
                email: "example@example.com",
                remindAt: "2025-10-01T10:00:00Z",
                content: {
                  folderUid: folderUid,
                },
              },
            ],
          },
          verify: (response, setError) => {
            if (response.StatusCode == 201) {
              return true;
            } else {
              setError(
                "Failed to add reminder. Please check your inputs and try again."
              );
              return false;
            }
          },
        });
      },
    },
  };
}
