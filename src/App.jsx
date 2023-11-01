import {Container} from 'react-bootstrap';
import { Formik, Form, Field, useField } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

const validationSchema = Yup.object().shape({
	name: Yup.string()
				.min(2, 'Type minimum 2 letters')
				.required('Required field!'),
	password: Yup.string()
					 .required('Required')
					 .min(7, 'Type minimum 7 keys')
					 .test(
						'password-check',
						'Allowed only letters and digits',
						value => !/\D\W/ig.test(value)
					 ),
	email: Yup.string()
				 .required('Required')
				 .email('Type rigth-valid email!'),
	amount: Yup.number()
					.required('Required')
					.min(50, `Minimim donate is 50 `),
	currency: Yup.string()
					 .required('Required'),
	file: Yup.mixed()
				.required('Required'),
	description: Yup.string()
						 .required('Required')
						 .test(
							'word-count',
							'Minimum description words is 10',
							value => value && value.trim().split(/\s+/).length >= 10
						 )
						 .test(
							'word-count',
							'Maximum description words is 500',
							value => value && value.trim().split(/\s+/).length <= 500
						 ),
	agree: Yup.boolean()
				 .required('Required')
				 .oneOf([true], 'Need to agree with')
})

const CustomErrorMessage = ({errors, touched, name}) => {
	const error = errors[name]
	const touch = touched[name]
	return (
		<>
			{ error && touch ? (<ErrorMessage ms={error} />) : null }
		</>
	)
}
const ErrorMessage = ({ms}) => {
	return (
		<small className="form-text text-danger font-weight-bold">{ms}</small>
	)
}

const MyInput = ({label, labelClass, ...props}) => {
	const [field, meta, helpers] = useField(props);
	console.log(props);
	console.log(field);
	return (
		<>
			<label className={labelClass ? labelClass : 'fs-3 font-weight-bold'} htmlFor={`input-${props.type}-${props.name}`}>{label}</label>
			<input {...field} {...props} id={`input-${props.type}-${props.name}`} />
			{meta.error && meta.touched && <ErrorMessage ms={meta.error}/>}
		</>
	)
}

function App() {
	const [visiblePass, setVissiblePass] = useState(false);
    return (
		<div className="body pt-5">
			<Container>
				<Formik
					initialValues={{
						name: '',
						email: '', 
						password: '',
						amount: '',
						currency: '',
						description: '',
						file: null,
						agree: false
					}}
					validationSchema={validationSchema}
					onSubmit={(values, { setSubmitting }) => {
						setTimeout(() => {
						  alert(JSON.stringify(values, null, 2));
						  setSubmitting(false);
						}, 400);
					}}
				>
					{
						({
							errors, 
							touched,
							values,
							handleChange,
							handleBlur,
							handleSubmit,
							isSubmitting,
							setFieldValue
						})=> (
							<Form className="bg-warning p-4 border border-danger rounded">
								<h1 className='text-center'>Зробити благодійність</h1>
								<div className="form-group">
									<MyInput 
										label="Your Name" 
										type="text" 
										name='name'
										className="form-control"
										placeholder="Your name" />
								</div>
								<div className="form-group position-relative">
									<MyInput 
										label="Password" 
										type={!visiblePass ? 'password': 'text'}
										name='password'
										className="form-control"
										placeholder="Your password" 
									/>
									{values.password ? 
										<button type='button' style={{
											"position": 'absolute',
											"right": '13px',
											"top": '38px',
											'zIndex': '1',
											'cursor': 'pointer'
										}} onClick={()=> setVissiblePass((prev)=> !prev)}>{!visiblePass ? 'Show': 'Hide'}</button>
									: null}
								</div>
								<div className="form-group">
									<MyInput 
										label="Email address" 
										type='email'
										name='email'
										className="form-control"
										placeholder="Your email" 
									/>
								</div>
								<div className="form-group">
									<MyInput 
										label="Amount" 
										type='number'
										name='amount'
										className="form-control"
										placeholder="Write the summ" 
									/>
								</div>
								<div className="form-group">
									<label className="fs-3 font-weight-bold" htmlFor="exampleFormControlSelect">Currency</label>
									<Field name='currency' className="form-control" id="exampleFormControlSelect"
										as='select'
									>
										<option value=''>Choose the currency</option>
										<option value='UAH'>UAH</option>
										<option value='USD'>USD</option>
										<option value='EUR'>EUR</option>
										<option value='PLZ'>PLZ</option>
									</Field>
									<CustomErrorMessage errors={errors} touched={touched} name="currency" />
								</div>
								<div className="form-group">
									<label className="fs-3 font-weight-bold" htmlFor="exampleFormControlTextarea1">Type somethings</label>
									<Field name='description' placeholder='Something' className="form-control" id="exampleFormControlTextarea1"
										as="textarea"
									/>
									{errors.description && touched.description ? 
										<>
											<CustomErrorMessage errors={errors} touched={touched} name="description" />
											{values.description ? <ErrorMessage ms={`Now is ${values.description.trim().split(' ').length} words`}/> : null}
										</>
									: null}
								</div>
								<div className="form-group">
									<label className="fs-3 font-weight-bold" htmlFor="exampleFormControlFile1">Choose audio</label>
									<input name='file' accept="audio/*" type="file" className="form-control-file" id="exampleFormControlFile1"
										onChange={(e)=>{
											setFieldValue('file', e.target.files[0])
										}}
										onBlur={handleBlur}
									/>
									<CustomErrorMessage errors={errors} touched={touched} name="file" />
								</div>
								<div className="form-check mb-3 d-flex">
									<MyInput 
										label="Check me out"
										labelClass="form-check-label fs-3 font-weight-bold mr-3" 
										type='checkbox'
										name='agree'
										className="form-check-input"
									/>
								</div>
								<button disabled={isSubmitting} type="submit" className="btn btn-primary">Submit</button>
							</Form>
						)
					}
				</Formik>
			</Container>
		</div>
    );
}

export default App;












// const errors = {};
// //name
// if (!values.name) {
// 	errors.name = 'Required';
// } else if (values.name.length < 2) {
// 	errors.name = 'Type minimum 2 letters';
// }
// //password
// if (!values.password) {
// 	errors.password = 'Required';
// } else if (/\D\W/ig.test(values.password)) {
// 	errors.password = 'Allowed only letters and digits';
// }else if (values.password.length < 7) {
// 	errors.password = 'Type minimum 7 keys';
// }
// //email
// if (!values.email) {
// 	errors.email = 'Required';
// } 
// else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
// 	errors.email = 'Invalid email address';
// }

// //amount
// if (!values.amount) {
// 	errors.amount = 'Required';
// } else if (values.amount < 50) {
// 	errors.amount = `Minimim donate is 50 ${values.currency && values.currency !== 'Choose the currency' ? values.currency : 'points'}`;
// }

// //currency
// if (!values.currency) {
// 	errors.currency = 'Required';
// }

// //file
// if (!values.file) {
// 	errors.file = 'Required';
// }

// //description
// if (!values.description) {
// 	errors.description = 'Required';
// } else if (values.description.trim().split(' ').length < 10) {
// 	errors.description = `Minimim description words is 10`;
// }else if (values.description.trim().split(' ').length > 500) {
// 	errors.description = `Maximum description words is 500`;
// }

// //agree
// if (!values.agree) {
// 	errors.agree = 'Required';
// }

// return errors;
