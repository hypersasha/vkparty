import React, {Component} from 'react';
import {Avatar, Button, Cell, Div, Footer, Group, Header, Link, List} from "@vkontakte/vkui/src";
import CreatePartyForm from "../NewParty/CreatePartyForm";
import PropTypes from 'prop-types';
import {getTextDate} from "../../../lib/Utils";

class PartyInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let objectDate = null;
        let date = this.props.date;
        let optionDate = null;
        if (!this.props.date) {
            date = "Дата не указана";
        } else {
            objectDate = new Date(date);
            date = getTextDate(objectDate);
            optionDate = objectDate.getFullYear() + '-' + (objectDate.getMonth()+1) + '-' + objectDate.getDate();
        }

        return(
            <div id="mainInfo">
                <Group style={{marginTop: 60}}>
                    <Cell
                        before={<Avatar
                            src={"https://www.tasteofhome.com/wp-content/uploads/2017/10/Six-Layer-Dinner_exps6019_W101973175B07_06_3bC_RMS-2.jpg"}
                            size={80}/>}
                        size="l"
                        description={this.props.owner || "Организатор"}
                        bottomContent={
                            <div className="rave--event-date">{date}</div>
                        }
                    >
                        {this.props.title}
                    </Cell>
                </Group>
                <Group description={"Люди, отмеченные серым цветом, не подтвердили своего участия."}>
                    <Header level="2" aside={<Link>Изменить</Link>}>участники</Header>
                    <List>
                        <Cell
                            removable={false}
                            removePlaceholder={"Исключить"}
                            before={<Avatar
                                src={"https://pp.userapi.com/c841227/v841227164/7c931/jiyCe7qzdJw.jpg?ava=1"}
                                size={48}/>}>
                            Александр Белов
                        </Cell>
                        <Cell
                            removable={false}
                            removePlaceholder={"Исключить"}
                            className={"guest--no-confirmed"}
                            before={<Avatar
                                src={"https:\\/\\/pp.userapi.com\\/c636719\\/v636719044\\/1e509\\/_-3LN6hoebk.jpg?ava=1"}
                                size={48}/>}>
                            Сергей Бродский
                        </Cell>
                        <Cell
                            removable={false}
                            removePlaceholder={"Исключить"}
                            before={<Avatar
                                src={"https:\\/\\/pp.userapi.com\\/Spw8dwKuU3tUCMeQiKb7VBdgq4uSF3EzZSBDIw\\/G09X32lEzoc.jpg?ava=1"}
                                size={48}/>}>
                            Артем Скачков
                        </Cell>
                    </List>
                    <Div style={{display: 'flex'}}>
                        <Button size="m" align="center">Пригласить друзей</Button>
                    </Div>
                </Group>
                <Footer>2 активных участника</Footer>
                <Group title={"Настройки"}>
                    <CreatePartyForm
                        onSubmit={(formData) => {
                            console.log(formData)
                        }}
                        title={this.props.title}
                        date={optionDate}
                        private={this.props.private}
                        submitButtonText={"Сохранить"}
                    />
                </Group>
            </div>
        );
    }
}

PartyInfo.propTypes = {
    date: PropTypes.string,
    title: PropTypes.string,
    private: PropTypes.bool
};

PartyInfo.defaultProps = {
    title: "Без Названия",
    private: false
};

export default PartyInfo;