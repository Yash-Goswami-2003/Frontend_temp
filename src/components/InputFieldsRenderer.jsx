import { FormProvider, useForm } from "react-hook-form";
import ComponentRenderer from "./ComponentRenderer";

function InputFieldsRenderer({configs}) {

    return (
        configs.map((config, index) => (
            <ComponentRenderer key={index} config={config} />
        ))
    );
}

export default InputFieldsRenderer;
