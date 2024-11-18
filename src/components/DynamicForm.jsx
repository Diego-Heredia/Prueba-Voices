import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
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

    
    const inputType = (() => {
      switch (type) {
        case "number":
        case "email":
        case "date":
          return type; 
        case "phone_number":
        case "cp":
        case "card":
          return "text";
        default:
          return "text"; 
      }
    })();

    // Renderizar campos de entrada e inputs según el tipo
    switch (type) {
      case "text":
      case "number":
      case "email":
      case "phone_number":
      case "cp":
      case "card":
      case "date":
        return (
          <div key={key} className="mb-3">
            <label className="form-label">{label}</label>
            <input
              className={`form-control ${error ? "is-invalid" : ""}`}
              type={inputType}
              {...methods.register(sanitizedLabel, validationRules)} // Registrar el campo con validaciones
            />
            {error && (
              <small className="text-danger">{error.message}</small> 
            )}
          </div>
        );
      case "select":
        return (
          <div key={key} className="mb-3">
            <label className="form-label">{label}</label>
            <select
              className={`form-select ${error ? "is-invalid" : ""}`}
              {...methods.register(sanitizedLabel, validationRules)} // Registrar select
              onChange={(e) =>
                handleSubform(label, e.target.value, subform) // Manejar subformulario dinamico
              }
            >
              <option value="">Seleccione...</option>
              {options.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && (
              <small className="text-danger">{error.message}</small> 
            )}
          </div>
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
            subform?.map((control, idx) => renderField(control, `${field}-${idx}`))
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
