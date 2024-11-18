import { useState } from "react";
import DynamicForm from "./DynamicForm";
import formData1 from "../data/ejemplo-1.json";
import formData2 from "../data/ejemplo-2.json";

const FormToggle = () => {
  const [activeExample, setActiveExample] = useState("ejemplo-1");

  const handleToggle = (example) => {
    setActiveExample(example);
  };

  const currentForms =
    activeExample === "ejemplo-1" ? formData1.forms : formData2.forms;

  return (
    <div className="container">
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group" role="group">
          <button
            className={`btn ${
              activeExample === "ejemplo-1" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleToggle("ejemplo-1")}
          >
            Ejemplo 1
          </button>
          <button
            className={`btn ${
              activeExample === "ejemplo-2" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleToggle("ejemplo-2")}
          >
            Ejemplo 2
          </button>
        </div>
      </div>

      <div className="row">
        {currentForms.map((form, index) => {
          const columnClass =
            currentForms.length === 1
              ? "col-12"
              : currentForms.length === 2
              ? "col-12 col-md-6"
              : "col-12 col-md-6 col-lg-4";

          return (
            <div key={index} className={`${columnClass} mb-4`}>
              <div className="card h-100">
                <div className="card-body">
                  <DynamicForm formDefinition={form} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormToggle;
