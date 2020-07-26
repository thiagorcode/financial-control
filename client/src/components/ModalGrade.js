import React, { useState, useEffect } from 'react'
import Modal from "react-modal"

import ServiceHttp from "../services/TransactionService";
import css from "./helpers/modal.module.css";

Modal.setAppElement('#root')

export default function ModalGrade({ onClose, identifier, change }) {
   const initialForm = {
      description: "",
      type: "",
      value: '',
      category: '',
      year: '',
      month: '',
      day: '',
      yearMonth: '',
      yearMonthDay: '',
   }

   const [gradeForm, setGradeForm] = useState(initialForm);

   const getData = async (id) => {
      const find = await ServiceHttp.findOne(id) // Analisar funções assim para o effect
      setGradeForm(find.data.report)

   }
   console.log(gradeForm)
   useEffect(() => {
      if (change) getData(identifier)
   }, [identifier])

   let valueDate = ""
   const handleInputChange = (event) => {
      const { name, value } = event.target;

      if (name === "date") { // Tira os - de date separa campo YYYY MM DD   
         valueDate = value.split("-");
         setGradeForm({
            ...gradeForm,
            day: parseInt(valueDate[2]),
            month: parseInt(valueDate[1]),
            year: parseInt(valueDate[0]),
            yearMonth: `${valueDate[0]}-${valueDate[1]}`,
            yearMonthDay: value
         });
         return
      }
      setGradeForm({ ...gradeForm, [name]: value });
   }

   const handleFormSubmit = async (event) => {
      event.preventDefault();

      const data = {
         description: gradeForm.description,
         type: gradeForm.type,
         value: parseInt(gradeForm.value),
         category: gradeForm.category,
         year: gradeForm.year,
         month: gradeForm.month,
         day: gradeForm.day,
         yearMonth: gradeForm.yearMonth,
         yearMonthDay: gradeForm.yearMonthDay,
      };
      let respost = await ServiceHttp.create(data);
      console.log(respost) // Colocar uma mensagem que fale que foi efetuado com sucesso

      onClose(null);
   }
   const handleClickUpdate = async (event) => {
      event.preventDefault();

      const data = {
         description: gradeForm.description,
         type: gradeForm.type,
         value: parseInt(gradeForm.value),
         category: gradeForm.category,
         year: gradeForm.year,
         month: gradeForm.month,
         day: gradeForm.day,
         yearMonth: gradeForm.yearMonth,
         yearMonthDay: gradeForm.yearMonthDay,
      };
      await ServiceHttp.update(gradeForm.id, data)
      onClose(null);
   }
   const handleModalClose = () => {
      onClose(null);
   };

   return (
      <div  >
         <Modal isOpen={true} >
            <div className={css.row}>
               <div >
                  {
                     !change ? <h3>Novo Lançamento</h3> : <h3>Editar Lançamento</h3>
                  }
                  <button className="waves-effect waves-lights btn red dark-4"
                     onClick={handleModalClose}>X</button>
               </div>
               <form onSubmit={!change ? handleFormSubmit : handleClickUpdate}>
                  <div>
                     <p>
                        <label>
                           <input
                              name="type"
                              type="radio"
                              value="-"
                              required
                              onChange={handleInputChange}
                           />
                           <span>Despesa</span>
                        </label>
                     </p>
                     <p>
                        <label>
                           <input
                              name="type"
                              type="radio"
                              value="+"
                              required
                              onChange={handleInputChange}
                           />
                           <span>Receita</span>
                        </label>
                     </p>
                  </div>
                  <div className="input-field">
                     <input
                        type="text"
                        id="description"
                        required
                        name="description"
                        onChange={handleInputChange}
                        value={gradeForm.description}
                     />
                     <label htmlFor="description" className="active">Descrição:</label>
                  </div>
                  <div className="input-field">
                     <input
                        type="text"
                        required
                        name="category"
                        id="category"
                        onChange={handleInputChange}
                        value={gradeForm.category}
                     />
                     <label htmlFor="category" className="active">Categoria:</label>
                  </div>
                  <div className="input-field">
                     <input
                        type="number"
                        id="value"
                        required
                        name="value"
                        min="0"
                        onChange={handleInputChange}
                        value={gradeForm.value}
                     />
                     <label htmlFor="value" className="active">Valor:</label>
                  </div>
                  <div className="input-field">
                     <input
                        type="date"
                        name="date"
                        required
                        id="date"
                        onChange={handleInputChange}
                        value={gradeForm.yearMonthDay}
                     />
                     <label htmlFor="date" className="active">Data:</label>
                  </div>
                  <button className="btn waves-effect waves-ligh col s3" >Enviar</button>
               </form>
            </div>
         </Modal>
      </div>
   )
}
