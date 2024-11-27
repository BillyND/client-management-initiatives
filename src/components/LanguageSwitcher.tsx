import { GlobalOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = useMemo(
    () => [
      { key: "vi", label: "Tiếng Việt" },
      { key: "en", label: "English" },
    ],
    []
  );

  const currentLanguageLabel = useMemo(
    () =>
      languages.find((lang) => lang.key === i18n.language)?.label || "Language",
    [languages, i18n.language]
  );

  const handleMenuClick: MenuProps["onClick"] = useCallback(
    ({ key }: { key: string }) => {
      if (key !== i18n.language && languages.some((lang) => lang.key === key)) {
        i18n.changeLanguage(key);
        window.location.reload();
      }
    },
    [languages, i18n]
  );

  return (
    <Dropdown
      menu={{
        items: languages.map(({ key, label }) => ({ key, label })),
        onClick: handleMenuClick,
      }}
      trigger={["click"]}
    >
      <Button>
        <Space className="cursor-pointer">
          <GlobalOutlined />
          {currentLanguageLabel}
        </Space>
      </Button>
    </Dropdown>
  );
}

export default LanguageSwitcher;
