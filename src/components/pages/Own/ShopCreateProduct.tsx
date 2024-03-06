import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Step,
    StepLabel,
    Stepper,
    TextField,
} from "@mui/material";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import Title from "../../Title";

import { EProduct, ProductType } from "../../../constants/Product";
import Card from "../../Card";
import { CloudUpload } from "@mui/icons-material";
import instance from "../../../axios";
import { EMessage } from "../../../constants/Message";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../layout/OwnLayout";
import useFormatWords from "../../../hooks/useFormatText";

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const VisuallyHiddenInput = styled.input`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1;
`;

const notes = ["New", "Trend", "Hot", "Sale", "None"];
const ShopCreateProduct = () => {
    const [imageFiles, setImageFiles] = useState<Blob[]>([]);
    const [product, setProduct] = useState<ProductType>({
        name: "",
        description: "",
        price: "",
        quantity: "",
        type: null,
        note: "",
        images: [],
    });
    const { shopActive } = useContext(ShopContext);
    const navigate = useNavigate();
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const imageFiles: Blob[] = Array.from(e.target.files).filter(
                (file: Blob) => file.type.startsWith("image/")
            );
            const imageUrls = imageFiles.map((file: Blob) =>
                URL.createObjectURL(file)
            );
            setProduct((pre) => ({ ...pre, images: imageUrls }));
            setImageFiles(imageFiles);
        }
    };
    const { capitalizeTextFormat } = useFormatWords();

    const steps = ["Product information", "Product photos"];
    const [activeStep, setActiveStep] = useState<number>(0);
    const handleSubmitForm = () => {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("price", product.price);
        formData.append("quantity", product.quantity);
        formData.append(
            "type",
            product.type ? product.type.toString() : "OTHER"
        );
        formData.append("note", product.note);

        imageFiles.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        instance
            .post(`/own/${shopActive?.name}/product`, formData)
            .then((res) => {
                if (res.data.status === EMessage.SUCCESS) {
                    navigate(`/shop/${shopActive?.name}/product/all`);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Container
            sx={{
                paddingBottom: 2,
                display: "flex",
                justifyContent: "center",
            }}>
            <Card column={2} columnTablet={1} columnPhone={1} size="large">
                <StyledForm>
                    <Title size="small" textAlign="center">
                        Create product
                    </Title>

                    <Box sx={{ padding: 2 }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>

                    {activeStep === 0 ? (
                        //    Step 1
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                                sx={{
                                    display: "flex",

                                    alignItems: "center",
                                    gap: "16px",
                                }}>
                                <TextField
                                    sx={{ flex: "2" }}
                                    label="Product's name"
                                    value={product.name}
                                    onChange={(e) =>
                                        setProduct((pre) => ({
                                            ...pre,
                                            name: e.target.value,
                                        }))
                                    }
                                />
                                <FormControl
                                    sx={{ flex: 1, maxWidth: "100px" }}>
                                    <InputLabel>Product's note</InputLabel>
                                    <Select
                                        label="Product's note"
                                        value={product.note}
                                        onChange={(
                                            event: SelectChangeEvent
                                        ) => {
                                            setProduct((pre) => ({
                                                ...pre,
                                                note: event.target.value,
                                            }));
                                        }}>
                                        {notes.map((note) => (
                                            <MenuItem
                                                key={note}
                                                value={`${note}`}>
                                                {note}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: "16px",
                                    flexWrap: "wrap",
                                }}>
                                <TextField
                                    sx={{ flex: "1" }}
                                    label="Product's quantity"
                                    type="number"
                                    value={product.quantity}
                                    onChange={(e) =>
                                        setProduct((pre) => ({
                                            ...pre,
                                            quantity: e.target.value,
                                        }))
                                    }
                                />
                                <TextField
                                    sx={{ flex: "1" }}
                                    label="Product's price"
                                    type="number"
                                    value={product.price}
                                    onChange={(e) =>
                                        setProduct((pre) => ({
                                            ...pre,
                                            price: e.target.value,
                                        }))
                                    }
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                <FormLabel>Product's type</FormLabel>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: "8px",
                                        flexWrap: "wrap",
                                    }}>
                                    {shopActive?.productTypes.map((type) => (
                                        <FormControlLabel
                                            control={<Checkbox size="small" />}
                                            label={capitalizeTextFormat(type)}
                                            value={type}
                                            checked={product.type == type}
                                            onChange={(
                                                _e: React.SyntheticEvent<
                                                    Element,
                                                    Event
                                                >,
                                                checked: boolean
                                            ) =>
                                                setProduct((pre) => ({
                                                    ...pre,
                                                    type: checked ? type : null,
                                                }))
                                            }
                                        />
                                    ))}
                                </Box>
                            </Box>
                            <TextField
                                label="Product's description"
                                rows={3}
                                multiline={true}
                                value={product.description}
                                onChange={(e) =>
                                    setProduct((pre) => ({
                                        ...pre,
                                        description: e.target.value,
                                    }))
                                }
                            />
                        </Box>
                    ) : (
                        // Step 2
                        <Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "8px",
                                    flexWrap: "wrap",
                                    marginBottom: "16px",
                                }}>
                                {product.images.map((url, index) => (
                                    <Box
                                        sx={{
                                            border: "1px solid #ccc",
                                            borderRadius: "5px",
                                            padding: "4px",
                                            width: "200px",
                                        }}>
                                        <img
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "contain",
                                            }}
                                            key={index}
                                            src={url}
                                            alt={`Hình ảnh ${index + 1}`}
                                        />
                                    </Box>
                                ))}
                            </Box>
                            <Button
                                component="label"
                                variant="contained"
                                tabIndex={-1}
                                size="large"
                                startIcon={<CloudUpload />}>
                                Upload Images
                                <VisuallyHiddenInput
                                    type="file"
                                    multiple
                                    onChange={handleImageUpload}
                                />
                            </Button>
                        </Box>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                        <Button
                            sx={{ marginTop: 2 }}
                            variant="outlined"
                            size="large"
                            onClick={() =>
                                activeStep > 0 &&
                                (product.type === EProduct.OTHER ||
                                product.type === EProduct.ACCESSORIES
                                    ? setActiveStep(0)
                                    : setActiveStep((pre) => --pre))
                            }
                            disabled={!(activeStep > 0)}>
                            Back
                        </Button>
                        <Button
                            sx={{ marginTop: 2 }}
                            variant="contained"
                            size="large"
                            onClick={() =>
                                activeStep === steps.length - 1
                                    ? handleSubmitForm()
                                    : setActiveStep((pre) => ++pre)
                            }>
                            {activeStep === steps.length - 1
                                ? "Finish"
                                : "Next"}
                        </Button>
                    </Box>
                </StyledForm>
            </Card>
        </Container>
    );
};

export default ShopCreateProduct;
