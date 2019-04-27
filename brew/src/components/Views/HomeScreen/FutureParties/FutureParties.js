import React, {Component} from 'react';
import {Avatar, Cell, List} from "@vkontakte/vkui/src";

import {getTextDate} from "../../../../lib/Utils";
import PropTypes from 'prop-types';

class FutureParties extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const {futureParties, ...restProps} = this.props;
        let parties = futureParties.map((party) => {
            let date = party.date;
            if (date) {
                date = new Date(date);
                date = getTextDate(date);
            } else {
                date = "Дата не указана";
            }
            return <Cell
                key={party.pid}
                before={<Avatar
                    src={"https://www.tasteofhome.com/wp-content/uploads/2017/10/Six-Layer-Dinner_exps6019_W101973175B07_06_3bC_RMS-2.jpg"}
                    size={72}/>}
                expandable={true}
                size="l"
                description={party.owner || "Организатор"}
                bottomContent={
                    <div className="rave--event-date">{date}</div>
                }
                onClick={() => {this.props.onOpenParty(party.pid)}}
            >
                {party.title || "Без Названия"}
            </Cell>
        });
        return (
            <List>
                {parties}
            </List>
        )
    }
}

FutureParties.propTypes = {
    onOpenParty: PropTypes.func.isRequired,
    futureParties: PropTypes.array.isRequired
};



export default FutureParties;