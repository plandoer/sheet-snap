module.exports = ({ config }) => {
  const isEASBuild = process.env.EAS_BUILD === "true";
  const invitationLinkBaseUrl =
    process.env.EXPO_PUBLIC_INVITATION_LINK_BASE_URL;

  if (isEASBuild && !invitationLinkBaseUrl) {
    throw new Error(
      "EXPO_PUBLIC_INVITATION_LINK_BASE_URL is required for invitation links.",
    );
  }

  const android = { ...config.android };

  if (invitationLinkBaseUrl) {
    const invitationUrl = new URL(invitationLinkBaseUrl);

    if (isEASBuild && invitationUrl.protocol !== "https:") {
      throw new Error("EXPO_PUBLIC_INVITATION_LINK_BASE_URL must use HTTPS.");
    }

    android.intentFilters = [
      ...(android.intentFilters ?? []),
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
