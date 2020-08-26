import React from 'react';
import { post } from 'axios'; // post방식으로 서버에 보내기 위해
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { DialogActions } from '@material-ui/core';

const styles = theme => ({
    hidden: {
        display: 'none'
    }
});

class GifticonAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            barcode_img: null,
            name: '',
            exp_date: '',
            used: '',
            fileName: '',
            open: false // 다이얼로그가 열려 있는 지
        }
    }

    // 추가 버튼을 누르면 실행
    // 내부적으로 이벤트 함수를 전달받는다.
    handleFormSubmit = (e) => {
        e.preventDefault() // 오류가 발생하지 않도록
        this.addGifticon()
            // 고객을 추가 후 서버로부터 응답받고나서 실행
            .then((response) => {
                console.log(response.data);
                // App.js의 stateRefresg()호출해서
                // 부모 컴포넌트(App)의 state값 갱신 시켜준다.
                this.props.stateRefresh();
            })
        this.setState({
            barcode_img: null,
            name: '',
            exp_date: '',
            used: '',
            fileName: '',
            open: false
        })

    }

    // 파일 값이 변경됐을 때
    handleFileChange = (e) => {
        this.setState({
            barcode_img: e.target.files[0],
            fileName: e.target.value
        })
    }

    // 텍스트 값이 변경됐을 때
    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    addGifticon = () => {
        const url = 'https://gifticon-management.herokuapp.com/api/gifticons';
        // 특정한 데이터를 서버로 보내기 위해
        const formData = new FormData();
        formData.append('barcode_img', this.state.barcode_img);
        formData.append('name', this.state.name);
        formData.append('exp_date', this.state.exp_date);
        formData.append('used', this.state.used);
        // 파일이 포함된 데이터를 서버로 전송 => header추가 
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return post(url, formData, config);
    }

    handleClickOpen = () => {
        this.setState({
            open: true
        })
    }

    handleClose = () => {
        this.setState({
            barcode_img: null,
            name: '',
            exp_date: '',
            used: '',
            fileName: '',
            open: false // 다이얼로그가 열려 있는 지
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
                    추가하기
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>기프티콘 추가</DialogTitle>
                    <DialogContent>
                        <input className={classes.hidden} type="file" accept="image/*" id="raised-button-file" file={this.state.barcode_img} value={this.state.fileName} onChange={this.handleFileChange} />
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" color="primary" component="span" name="file">
                                {this.state.fileName === "" ? "기프티콘 이미지 선택" : this.state.fileName}
                            </Button>
                        </label>
                        <br />
                        <TextField label="이름" type="text" name="name" value={this.state.name} onChange={this.handleValueChange} /><br />
                        <TextField label="유효기한" type="text" name="exp_date" value={this.state.exp_date} onChange={this.handleValueChange} /><br />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleFormSubmit}>추가</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleClose}>닫기</Button>
                    </DialogActions>
                </Dialog>
            </div>

        )
    }
}

export default withStyles(styles)(GifticonAdd);