import {Button} from 'hbg-react';

module.exports = (props) => (
  <form onSubmit={props.submitSearchMethod}>
        <div className="grid">
            <div className="grid-xs-auto">
                <input type="text" onChange={props.searchMethod} placeholder="Search" />
            </div>
            <div className="grid-fit-content">
                <Button title="Search" color="primary" submit />
            </div>
        </div>
    </form>
);


