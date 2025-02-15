import Button from "@/shared/components/button";
import { useI18n } from "@/shared/hooks/use-i18n";
import onActionClickTest from "../../lib/helpers/test";

const Popup = () => {
  const { t } = useI18n();
  return (
    <div className="flex w-[300px] h-[200px] flex-col items-center justify-center gap-2 font-bold">
      {t("popup.hello")}
      <Button variant="primary" onClick={onActionClickTest}>
        Click me!
      </Button>
    </div>
  );
};

export default Popup;
