import React, {Component} from 'react';
import axios from 'axios';

import {
    Div,
    Footer, FormStatus,
    Group,
    HeaderButton,
    PanelHeader
} from "@vkontakte/vkui/src";

import CreatePartyForm from "./CreatePartyForm";

import './addparty.less';
import {SERVER_URL} from "../../../lib/Utils";

class AddParty extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formStatus: {
                title: '',
                description: '',
                state: 'default'
            }
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    /**
     * Triggers when user pressed a "Create" button.
     */
    onSubmit(formData) {

        if (!this.props.userId || this.props.userId < 0) {
            console.error("Cannot create party, cause you don't have VK ID.")
            return false;
        }

        axios.post(SERVER_URL + '/party', {
            title: formData.title,
            user_id: this.props.userId,
            date: formData.date,
            isPrivate: formData.private,
            max_movies: formData.max_movies,
            info: formData.info
        }).then((response) => {
            let data = response.data;
            if (data.isOK) {
                window.location.hash = data.data.pid;
                this.props.onChangeView("homeScreen");
            }
        }).catch((err) => {
            this.setState({
                formStatus: {
                    title: "Событие не создано :(",
                    description: "Вы все сделали правильно, но мы не можем установить соединение с сервером.",
                    state: 'error'
                }
            })
        })
    }

    render() {
        return (
            <div>
                <PanelHeader
                    left={<HeaderButton onClick={() => {
                        this.props.onChangeView('homeScreen');
                    }}>Отмена</HeaderButton>}>
                    <div className="rave--header-title">
                        Новое событие
                    </div>
                </PanelHeader>
                {/*<Group>*/}
                {/*    <div className={'newRave-intro'}>*/}
                {/*        <div className="newRave-intro--icon"></div>*/}
                {/*        <div className="newRave-intro--description">*/}
                {/*            <p>Укажите название, дату и статус вечеринки. Затем, пригласите в неё друзей.</p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</Group>*/}
                <Group title={"Создание вечеринки"}>
                    {this.state.formStatus.state === "error" ? <Div>
                        <FormStatus title={this.state.formStatus.title} state={this.state.formStatus.state}>
                            {this.state.formStatus.description}
                        </FormStatus>
                    </Div> : ''}
                    <CreatePartyForm onSubmit={(formData) => this.onSubmit(formData)} />
                </Group>
                <Footer>После создания вечеринки, Вы сможете пригласить в нее друзей.</Footer>
            </div>
        );
    }
}

export default AddParty;