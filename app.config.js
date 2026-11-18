module.exports = ({ config }) => {
  const easProjectId = process.env.EAS_PROJECT_ID;
  const invitationLinkBaseUrl =
    process.env.EXPO_PUBLIC_INVITATION_LINK_BASE_URL;

  if (!easProjectId) {
    throw new Error("EAS_PROJECT_ID must be set to configure the EAS project.");
  }

  if (!invitationLinkBaseUrl) {
    throw new Error(
      "EXPO_PUBLIC_INVITATION_LINK_BASE_URL must be set to configure Android App Links.",
    );
  }

  const invitationUrl = new URL(invitationLinkBaseUrl);

  if (invitationUrl.protocol !== "https:") {
    throw new Error("EXPO_PUBLIC_INVITATION_LINK_BASE_URL must use HTTPS.");
  }

  return {
    ...config,
    extra: {
      ...config.extra,
      eas: {
        ...config.extra?.eas,
        projectId: easProjectId,
      },
    },
    android: {
      ...config.android,
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: invitationUrl.protocol.slice(0, -1),
              host: invitationUrl.hostname,
              pathPrefix: "/join-group",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
  };
};
