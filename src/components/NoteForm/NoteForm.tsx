import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css'; // Імпорт CSS-модуля
import { NoteTag } from '../../types/note';
import { CreateNoteParams } from '../../services/noteService';

interface NoteFormProps {
  onSubmit: (values: CreateNoteParams) => void;
  onCancel: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, onCancel }) => {
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, 'Заголовок має бути не менше 3 символів')
      .max(50, 'Заголовок має бути не більше 50 символів')
      .required('Заголовок є обов\'язковим полем'),
    content: Yup.string()
      .max(500, 'Контент має бути не більше 500 символів'),
    tags: Yup.string() // Оскільки в формі select повертає string, валідуємо його як string
      .oneOf<NoteTag>(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Невірний тег')
      .required('Тег є обов\'язковим полем'),
  });

  const formik = useFormik<CreateNoteParams>({
    initialValues: {
      title: '',
      content: '',
      tags: ['Todo'], // Початкове значення для select
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      // Formik працює з масивом тегів, але в формі select повертає один string.
      // Перетворюємо назад в масив для API
      const tagsArray: NoteTag[] = [values.tags[0]]; // Припускаємо, що в формі один тег
      onSubmit({ ...values, tags: tagsArray });
      setSubmitting(false);
    },
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title && (
          <span className={css.error}>{formik.errors.title}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.content && formik.errors.content && (
          <span className={css.error}>{formik.errors.content}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tags" // Ім'я повинно відповідати полю в initialValues, яке в даному випадку 'tags'
          className={css.select}
          value={formik.values.tags[0]} // Оскільки select повертає один рядок, беремо перший елемент масиву
          onChange={(e) => formik.setFieldValue('tags', [e.target.value])} // Оновлюємо поле 'tags' як масив з одним елементом
          onBlur={formik.handleBlur}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {formik.touched.tags && formik.errors.tags && (
          <span className={css.error}>{String(formik.errors.tags)}</span> // Привести до string, оскільки помилка може бути масивом
        )}
      </div>

      <div className={css.actions}>
        <button type="button" onClick={onCancel} className={css.cancelButton}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={formik.isSubmitting || !formik.isValid}
        >
          Create note
        </button>
      </div>
    </form>
  );
};

export default NoteForm;