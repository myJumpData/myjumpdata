import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import AuthVerify from "../../common/AuthVerify";
import AdminActionBar from "../../components/AdminActionBar";
import Button from "../../components/Button";
import { SelectInput, TextInput } from "../../components/Input";
import { ISOCountry } from "../../Constants";
import { setRoute } from "../../redux/route.action";
import { createClub } from "../../service/admin.service";
import { useNavigate } from "react-router-dom";

export default function AdminClubCreateScreen() {
  useEffect(() => {
    setRoute("admin/club");
    AuthVerify({
      isAdmin: true,
    });
  }, []);

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [country, setCountry] = useState<string>(i18n.language.toUpperCase());
  const [state, setStateText] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [image, setImage] = useState<string>("");

  return (
    <>
      <AdminActionBar text={`${t<string>("common:nav_club")} - Create`} />
      <div>
        <TextInput type="text" name="Name" stateChange={setName} value={name} />
        <span className="flex items-center space-x-4">
          <span className="opacity-75">Country</span>
          <span className="grow">
            <SelectInput
              options={Object.entries(ISOCountry).map(([key, value]) => {
                return {
                  value: key,
                  name: (
                    <span className="flex items-center space-x-4">
                      <span className="flex h-full w-8 items-center">
                        <Flag code={key.toLocaleLowerCase()} />
                      </span>
                      <span>{value}</span>
                    </span>
                  ),
                };
              })}
              stateChange={setCountry}
              current={country}
            />
          </span>
        </span>
        <TextInput
          type="text"
          name="State"
          stateChange={setStateText}
          value={state}
        />
        <TextInput type="text" name="City" stateChange={setCity} value={city} />
        <div className="flex items-center space-x-4">
          <TextInput
            type="text"
            name="Logo"
            stateChange={setImage}
            value={image}
          />
          <span className="w-16">
            {image.length > 0 ? <img src={image} alt="Logo" /> : null}
          </span>
        </div>
      </div>
      <Button
        name="Submit"
        design="success"
        onClick={() => {
          createClub(name, country, state, city, image).then((res: any) => {
            if (res.key === "success.create.club") {
              navigate(-1);
            }
          });
        }}
      />
    </>
  );
}
