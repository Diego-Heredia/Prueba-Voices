import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import TextInput from "./fields/TextInput";
import SelectField from "./fields/SelectField";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const DynamicForm = ({ formDefinition }) => {
  const methods = useForm();
  // Estado local para manejar los subformularios dinámicos
  const [subformState, setSubformState] = useState({});

  const onSubmit = (data) => {
    // Filtrar los datos para excluir los campos vacíos
    const filledData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value; // Solo agregamos campos con valores válidos
      }
      return acc;
    }, {});

    console.log("Datos llenados:", filledData);
  };

  const handleSubform = (field, value, subformCondition) => {
    // Si la condición se cumple, asignamos el subformulario correspondiente al estado
    const subform = subformCondition?.show_if_value_is === value
      ? subformCondition.form || subformCondition.forms || null
      : null;

    setSubformState((prev) => ({
      ...prev, 
      [field]: subform, 
    }));
  };

  const renderField = (control, key) => {
    const { label, type, options, is_mandatory, subform } = control;

    // Sanitizar el label para usarlo como clave válida
    const sanitizedLabel = label.replace(/\./g, "_");

    // Definir reglas de validación dinámicas según el tipo de campo
    const validationRules = {
      required: is_mandatory && "Este campo es obligatorio",
      ...(type === "email" && {
        pattern: {
          value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
          message: "Correo inválido",
        },
      }),
      ...(type === "phone_number" && {
        pattern: {
          value: /^\d{10}$/,
          message: "Debe contener 10 dígitos", 
        },
      }),
      ...(type === "cp" && {
        pattern: {
          value: /^\d{5}$/,
          message: "El código postal debe ser de 5 dígitos",
        },
      }),
      ...(type === "card" && {
        pattern: {
          value: /^\d{15,16}$/,
          message: "La tarjeta debe tener 15 o 16 dígitos", 
        },
      }),
      ...(type === "number" && {
        pattern: {
          value: /^-?\d+(\.\d+)?$/,
          message: "Solo se permiten números enteros o decimales",
        },
      }),
      ...(label === "Número Ext." || label === "Número Int." ? {
        pattern: {
          value: /.*\d.*/,
          message: "Debe incluir al menos un número", 
        },
      } : {}),
    };

    // Acceder al error del campo actual desde el estado de errores de React Hook Form
    const error = methods.formState.errors[sanitizedLabel];

    // Renderizar campos reutilizando componentes específicos
    switch (type) {
      case "text":
      case "number":
      case "email":
      case "phone_number":
      case "cp":
      case "card":
        return (
          <TextInput
            key={key}
            label={label}
            type={type === "cp" ? "text" : type}
            sanitizedLabel={sanitizedLabel}
            error={error}
            register={methods.register}
            validationRules={validationRules}
          />
        );
      case "select":
        return (
          <SelectField
            key={key}
            label={label}
            options={options}
            sanitizedLabel={sanitizedLabel}
            error={error}
            register={methods.register}
            validationRules={validationRules}
            onChange={(e) => handleSubform(label, e.target.value, subform)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="container mt-4 p-4 border rounded"
      >
        <fieldset>
          <legend>{formDefinition.legend}</legend>
          {formDefinition.controls.map((control, index) =>
            renderField(control, index) // Renderizar cada campo definido en el JSON
          )}

          {/* Renderizar subformularios activos */}
          {Object.entries(subformState).map(([field, subform]) =>
            subform?.map((control, idx) => (
                <motion.div
                key={`${field}-${idx}`}
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}  
                exit={{ opacity: 0, y: 10 }}   
                transition={{ duration: 0.3 }} 
                >
                {renderField(control, `${field}-${idx}`)}
                </motion.div>
            ))
        )}

          <button type="submit" className="btn btn-primary mt-3">
            Guardar
          </button>
        </fieldset>
      </form>
    </FormProvider>
  );
};

export default DynamicForm;
