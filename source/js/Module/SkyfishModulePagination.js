import {Button} from 'hbg-react';

module.exports = (props) => (
    <div>
        <div className="grid grid-va-middle">
            <div className="grid-xs-auto" key={props.current}>
                <input defaultValue={props.current} type="number" min="1" max={props.total} onChange={props.input} />
            </div>
            <div className="grid-fit-content">
                <span> / {props.total}</span>
            </div>

            <div className="grid-fit-content">
               <Button color="primary" onClick={props.prev} disabled={props.current == 1 ? true : false}><i className="pricon pricon-previous"></i> Previous</Button>
            </div>
            <div className="grid-fit-content">
                <Button  color="primary" onClick={props.next} disabled={props.current == props.total ? true : false}>Next <i className="pricon pricon-next"></i></Button>
            </div>
        </div>
    </div>
);
