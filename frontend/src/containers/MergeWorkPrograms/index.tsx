import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Select, FormControl, InputLabel, MenuItem, Button, Modal, Box, Typography} from '@material-ui/core';
import {WorkProgram, WorkProgramList} from '../UserProfile/types';
import {useStyles} from './MergeWorkProgramsBlock.styles';
import actions from '../WorkProgramList/actions';
import {filterFields} from '../WorkProgramList/enum';
import {getWorkProgramList} from '../WorkProgramList/getters';

type WorkProgramSelectType = 'source' | 'target'
type WorkProgramSelectProps = {
    type: WorkProgramSelectType;
    onChange: (x: number, type: WorkProgramSelectType) => void;
} & WorkProgramList;

const WorkProgramSelect = ({type, onChange, workPrograms}: WorkProgramSelectProps) => {
    const [value, setValue] = React.useState('');
    const labelId = `merge-work-programs-block-label-${type}`;

    const labelText = type === 'source' ? 'Откуда' : 'Куда';

    const handleChange = (event: any) => {
        setValue(event.target.value);
        onChange(event.target.value, type);
    };

    return (
        <FormControl fullWidth variant="outlined">
            <InputLabel id={labelId}>{labelText}</InputLabel>
            <Select
                labelId={labelId}
                value={value}
                label={labelText}
                onChange={handleChange}
            >
                {workPrograms.map((item: WorkProgram) => {
                        return <MenuItem value={item.id} key={`work-program-${item.id}`}>
                            {item.title}
                        </MenuItem>;
                    }
                )}
            </Select>
        </FormControl>
    )
};

type ModalProps = {
    open: boolean;
    handleClose: () => void;
    confirm: () => void;
};
const CopyWorkProgramsModal = ({open, handleClose, confirm}: ModalProps) => {
    const classes = useStyles();
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box className={classes.modal}>
                <Typography variant="h6" component="h2">
                    Вы уверенны, что хотите скопировать содержимое рабочей программы дисциплины?
                </Typography>
                <div className={classes.modalFooter}>
                    <Button color="primary" onClick={confirm}>Да</Button>
                    <Button color="secondary" onClick={handleClose}>Отмена</Button>
                </div>
            </Box>
        </Modal>
    )
};

export default ({className}: {className: string}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [sourceId, setSource] = React.useState(0);
    const [targetId, setTarget] = React.useState(0);
    const [modalIsOpen, handleModalOpen] = React.useState(false);
    const workPrograms = useSelector(getWorkProgramList);

    useEffect(() => {
        dispatch(actions.changeCurrentPage(1));
        dispatch(actions.changeFiltering({[filterFields.ONLY_MY]: true}));
        dispatch(actions.getWorkProgramList())
    }, []);

    const closeModal = () => handleModalOpen(false);
    const openModal = () => handleModalOpen(true);
    const mergeContent = () => {
        closeModal();
        dispatch(actions.mergeWorkProgram({sourceId, targetId}));
    };

    const disabled = !sourceId || !targetId;

    const selectWorkProgram = (val: number, type: WorkProgramSelectType) => {
        switch (type) {
            case "source":
                setSource(val);
                break;
            case "target":
                setTarget(val);
                break;
            default:
                break;
        }
    };

    if (workPrograms.length === 0) {
        return null;
    }

    return (
        <Box className={className}>
            <Typography className={classes.itemTitle}>
                Скопировать содержимое рабочей программы дисциплины
            </Typography>
            <div className={classes.root}>
                <div className={classes.controls}>
                    <WorkProgramSelect workPrograms={workPrograms} type="source" onChange={selectWorkProgram}/>
                    <WorkProgramSelect workPrograms={workPrograms} type="target" onChange={selectWorkProgram}/>
                </div>
                <Button disabled={disabled} color="secondary" onClick={openModal}>Копировать</Button>
            </div>
            <CopyWorkProgramsModal
                open={modalIsOpen}
                handleClose={closeModal}
                confirm={mergeContent}
            />
        </Box>
    )
}
