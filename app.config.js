module.exports = ({ config }) => {
  const invitationLinkBaseUrl =
    process.env.EXPO_PUBLIC_INVITATION_LINK_BASE_URL;
  const android = { ...config.android };

  if (invitationLinkBaseUrl) {
    const invitationUrl = new URL(invitationLinkBaseUrl);

    if (invitationUrl.protocol !== "https:") {
      throw new Error("EXPO_PUBLIC_INVITATION_LINK_BASE_URL must use HTTPS.");
    }

    android.intentFilters = [
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
    ];
  }

  return {
    ...config,
    android,
  };
};
