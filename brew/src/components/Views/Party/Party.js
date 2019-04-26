import React, {Component} from 'react';
import {
    Avatar, Button, Cell,
    FixedLayout, Group,
    HeaderButton,
    HorizontalScroll, List,
    PanelHeader,
    Tabs,
    Div,
    TabsItem, Footer, Header, Link, FormStatus
} from "@vkontakte/vkui/src";

import {SERVER_URL} from "../../../lib/Utils";

import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import CreatePartyForm from "../NewParty/CreatePartyForm";

import axios from 'axios';
import PanelSpinner from "@vkontakte/vkui/src/components/PanelSpinner/PanelSpinner";

class Party extends Component {
    constructor(props) {
        super(props);
        this.state = {
            panelScope: 'info',
            party_info: {
                title: "Кукинг Стрэм",
                date: "2019-04-28",
                private: true
            },
            loading: true,
            loadingFailed: false
        };
        this.onNavBack = this.onNavBack.bind(this);
    }

    onChangeScope(new_scope) {
        this.setState({
            panelScope: new_scope
        })
    }

    onNavBack() {
        window.location.hash = "";
        this.props.onChangePanel('raves');
    }

    componentWillMount() {

        if (window.location.hash) {
            const pid = window.location.hash.slice(1, window.location.hash.length);
            axios.get(SERVER_URL + '/party', {
                params: {
                    pid: pid,
                    user_id: 19592568
                }
            }).then((response) => {
                console.log(response);
                let res = response.data;
                if (res.isOK) {

                } else {
                    this.onNavBack();
                }
            }).catch(err => {
                this.setState({
                    loading: false,
                    loadingFailed: true
                });
            })
        }
    }

    render() {
        const loading = this.state.loading;
        return (
            <div id={"party-info"}>
                <PanelHeader
                    noShadow={true}
                    left={<HeaderButton onClick={() => {
                        this.onNavBack();
                    }}><Icon24BrowserBack/></HeaderButton>}
                >
                    <div className="rave--header-title">Событие</div>
                </PanelHeader>
                {loading ? <PanelSpinner height={170}/> : ''}
                <div>
                    <FixedLayout vertical={"top"}>
                        <Tabs theme={"header"} type={"buttons"}>
                            <HorizontalScroll>
                                <TabsItem selected={this.state.panelScope === "info"}
                                          onClick={() => {
                                              this.onChangeScope('info')
                                          }}>Информация</TabsItem>
                                <TabsItem selected={this.state.panelScope === "movies"}
                                          onClick={() => {
                                              this.onChangeScope('movies')
                                          }}>Фильмы</TabsItem>
                                <TabsItem selected={this.state.panelScope === "goods"}
                                          onClick={() => {
                                              this.onChangeScope('goods')
                                          }}>Покупки</TabsItem>
                            </HorizontalScroll>
                        </Tabs>
                    </FixedLayout>
                    <List style={{paddingTop: 60}}>
                        {this.state.loadingFailed ?
                            <Div>
                                <FormStatus title="Ошибка соединения" state={"error"}>
                                    Что-то или кто-то мешает нам подключиться к серверу. Попробуйте ещё разок.
                                </FormStatus>
                            </Div> : ''}
                        <Cell
                            before={<Avatar
                                src={"https://www.tasteofhome.com/wp-content/uploads/2017/10/Six-Layer-Dinner_exps6019_W101973175B07_06_3bC_RMS-2.jpg"}
                                size={80}/>}
                            size="l"
                            description={"Николай Таранов"}
                            bottomContent={
                                <div className="rave--event-date">Пятница, 22 апр. 2019</div>
                            }
                        >
                            Кукинг стрэм
                        </Cell>
                    </List>
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
                            title={"Кукинг стрэм"}
                            date={"2019-4-29"}
                            private={true}
                            submitButtonText={"Сохранить"}
                        />
                    </Group>
                </div>
            </div>
        );
    }
}

export default Party;