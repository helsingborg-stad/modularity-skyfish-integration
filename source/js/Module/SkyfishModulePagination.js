import {Button} from 'hbg-react';
const {translation} = skyfishAjaxObject;
module.exports = (props) => (
    <div>
        <div className="grid grid-va-middle">
            <div className="grid-xs-fit-content" key={props.current}>
                <input className="skyfish-module__pagination-input" defaultValue={props.current} type="number" min="1" max={props.total} onChange={props.input} />
            </div>
            <div className="grid-fit-content u-mr-auto">
                <span> / {props.total}</span>
            </div>

            <div className="grid-fit-content">
                <Button color="primary" onClick={props.prev} disabled={props.current == 1 ? true : false}>
                    <i className="pricon pricon-previous u-hidden@md u-hidden@lg u-hidden@xl"></i> <span className="u-hidden@xs u-hidden@sm">{translation.previous}</span>
                </Button>
            </div>
            <div className="grid-fit-content">
                <Button  color="primary" onClick={props.next} disabled={props.current == props.total ? true : false}>
                    <span className="u-hidden@xs u-hidden@sm">{translation.next}</span> <i className="pricon pricon-next u-hidden@md u-hidden@lg u-hidden@xl"></i>
                </Button>
            </div>
        </div>
    </div>
);
