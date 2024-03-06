import { Box, Button, Modal as ModalMui } from "@mui/material";
import styled from "styled-components";

export type ModalProps = {
    title: string;
    description: string;
    open: boolean;
    handleClose: () => void;
    handleConfirm?: () => void;
};

const StyledModal = styled(ModalMui)`
    .MuiBox-root {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 440px;
        max-width: 100%;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        padding: 16px 20px;
        border-radius: 10px;
        h3 {
            color: var(--text-color);
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 24px;
        }
        p {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 30px;
        }
        .modal_action {
            display: flex;
            gap: 8px;
            .MuiButton-root {
                flex: 1;
            }
        }
    }
`;

const Modal = ({
    title,
    description,
    open,
    handleClose,
    handleConfirm,
}: ModalProps) => {
    return (
        <StyledModal open={open} onClose={handleClose}>
            <Box>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="modal_action">
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        size="small">
                        Cancel
                    </Button>
                    {handleConfirm && (
                        <Button
                            onClick={() => {
                                handleConfirm();
                                handleClose();
                            }}
                            variant="contained"
                            size="small">
                            Confirm
                        </Button>
                    )}
                </div>
            </Box>
        </StyledModal>
    );
};

export default Modal;
