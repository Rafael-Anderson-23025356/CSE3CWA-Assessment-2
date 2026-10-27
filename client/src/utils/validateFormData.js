export function validateFormData(formData, setError){
    const requiredFields = [
        { key: "crop_name", label: "Crop Name" },
        { key: "location", label: "Location" },
        { key: "target_min", label: "Target minimum" },
        { key: "target_max", label: "Target maximum" },
        { key: "normal_water", label: "Normal water" },
    ];

    const missingField = requiredFields.find(
        ({ key }) =>
            formData?.[key] == null ||
            formData[key] === ""
    );

    if (missingField) {
        setError(`${missingField.label} cannot be empty.`);
        return false;
    }

    if (formData?.location?.length > 100){
        setError("Location length must be less than or equals to 100 characters.");
        return false;        
    }

    if (formData?.target_min >= formData?.target_max){
        setError("Maximum target must be greater than the minimum target.");
        return false;
    }

    if (formData?.target_min < 0 || formData?.target_min > 100){
        setError("Minimum target must be between 0 to 100.");
        return false;
    }

    if (formData?.target_max < 0 || formData?.target_max > 100){
        setError("Maximum target must be between 0 to 100.");
        return false;
    }

    if (formData?.normal_water < 1 || formData?.normal_water > 10000){
        setError("Normal water must be greater than 0 and at most 10000.");
        return false;
    }

    if (formData?.notes?.length > 500){
        setError("Notes must have 500 characters at most.");
        return false;
    }

    return true;
}