module.exports = ({ config }) => {
  const isPreview = process.env.APP_VARIANT === "preview";
  const isEASBuild = process.env.EAS_BUILD === "true";
  const invitationLinkBaseUrl =
    process.env.EXPO_PUBLIC_INVITATION_LINK_BASE_URL;

  if (isEASBuild && !invitationLinkBaseUrl) {
    throw new Error(
      "EXPO_PUBLIC_INVITATION_LINK_BASE_URL is required for invitation links.",
    );
  }

  const android = { ...config.android };
  android.package = isPreview
    ? "com.plandoer.sheetsnap.preview"
    : "com.plandoer.sheetsnap";
  android.adaptiveIcon = {
    ...config.android.adaptiveIcon,
    backgroundColor: "#ffffff",
    foregroundImage: isPreview
      ? "./assets/icons/adaptive-icon-preview.png"
      : "./assets/icons/adaptive-icon.png",
    monochromeImage: isPreview
      ? "./assets/icons/adaptive-icon-preview.png"
      : "./assets/icons/adaptive-icon.png",
  };
  const ios = { ...config.ios };
  const splashIcon = isPreview
    ? "./assets/icons/splash-icon-dark-preview.png"
    : "./assets/icons/splash-icon-dark.png";
  const splashIconLight = isPreview
    ? "./assets/icons/splash-icon-light-preview.png"
    : "./assets/icons/splash-icon-light.png";

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

  const plugins = config.plugins.map((plugin) => {
    if (!Array.isArray(plugin) || plugin[0] !== "expo-splash-screen") {
      return plugin;
    }

    return [
      plugin[0],
      {
        ...plugin[1],
        image: splashIcon,
        dark: {
          ...plugin[1].dark,
          image: splashIconLight,
        },
      },
    ];
  });

  return {
    ...config,
    name: isPreview ? "Sheet Snap Preview" : "Sheet Snap",
    icon: isPreview
      ? "./assets/icons/adaptive-icon-preview.png"
      : "./assets/icons/adaptive-icon.png",
    ios: {
      ...ios,
      bundleIdentifier: isPreview
        ? "com.plandoer.sheetsnap.preview"
        : "com.plandoer.sheetsnap",
    },
    android,
    plugins,
  };
};
