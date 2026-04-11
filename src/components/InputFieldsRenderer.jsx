import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ComponentRenderer from "./ComponentRenderer";

function InputFieldsRenderer({configs,formObject}) {

    return (
        <FormProvider {...formObject}>
        <form >
            {
                configs.map((config, index) => (
                    <ComponentRenderer key={index} config={config} />
                ))
            }
        </form>
        </FormProvider>
    );
}

export default InputFieldsRenderer;
