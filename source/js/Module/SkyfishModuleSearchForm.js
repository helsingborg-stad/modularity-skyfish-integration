import { Button } from "hbg-react";
const { translation } = skyfishAjaxObject;
export default props => (
	<form onSubmit={props.submitSearchMethod}>
		<div className="grid sm-gutter">
			<div className="grid-xs-auto">
				<input type="text" onChange={props.searchMethod} placeholder={translation.search} />
			</div>
			<div className="grid-fit-content">
				<Button title={translation.search} color="primary" submit />
			</div>
		</div>
	</form>
);
