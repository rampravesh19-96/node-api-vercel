import React, { useContext, useState, useEffect, useRef } from 'react'
import moment from 'moment'
import { Button } from '@mui/material'
import PrimaryButton from '../../../atoms/PrimaryButton'
import SecondaryButton from '../../../atoms/SecondaryButton'
import FullScreenPopup from '../../../organisms/FullScreenPopup'
import ProductCommonContext from '../../../../context/common/commonContext'
import {
    mapData,
    dateFormatFunction,
    dateTimeFormatFunction,
    handleRedirectInternal,
} from '../../../../common/components'
import CustomCommonContext from '../../../../../custom/context/common/commonContext'
import Loaders from '../../../molecules/Loaders'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { LinearProgress } from '@mui/material'
import AlertContext from '../../../../../product/context/alert/alertContext'
import { initialFunction, validationFunction, editValue } from './FieldFunction'
import ItemPropsList from './Item'
import { useTranslation } from 'react-i18next'
import CustomDialog from '../../../organisms/Dialog'
import settingContext from '@/product/context/setting/settingContext'

const BaseActionPage = (props) => {
    const data = props.data
    const arrayValue = props.arrayValue
    const { t } = useTranslation()
    const [charityOption, setCharityOption] = useState([])

    const { alldata_all_dropdown, allLocations } =
        useContext(CustomCommonContext)
    const alertContext = useContext(AlertContext)
    const { allCountries, allStates, allCities } =
        useContext(ProductCommonContext)
    const { setAlert } = alertContext
    const settingcontext = useContext(settingContext)
    const {
        searchTableAction,
        updateConfigColumn,
        searchTableFetch,
        search_fetch_data,
        responseStatus: responseStatusSetting,
        clearResponse: clearResponseCommuncation,
    } = settingcontext

    const [reload, setReload] = useState(false)
    const [valueLoaded, setValueLoaded] = useState(false)
    const [initialValues, setInitialValues] = useState({})
    const [initialEmptyValues, setInitialEmptyValues] = useState({})
    const [calculateFields, setCalculateFields] = useState([])
    const [validationArray, setValidationArray] = useState({})
    const [mapDataValue, setMapDataValue] = useState([])
    const [mapDataValue1, setMapDataValue1] = useState([])
    const [mapDataValue2, setMapDataValue2] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [arrayItemTrigger, SetArrayItemTrigger] = useState(false)
    const [additionalSubmit, setAdditionalSubmit] = useState('')
    const [itemPropsArrayErrors, SetItemPropsArrayErrors] = useState({})
    const [toggleDialogErr, setToggleDialogErr] = useState(false)

    const onAddItemArrayHandle = (option) => {
        if (formik.values.itemPropStep === 0) {
            SetArrayItemTrigger(true)
        }
        console.log(formik.values.itemPropStep, 'item step')
        formik.values.itemPropStep += 1
        formik.setFieldValue('itemPropStep', formik.values.itemPropStep)
    }

    const formSubmitFunction = (values, marketStatus) => {
        const value = values
        let tempMapData = mapDataValueRef.current

        value.customdatetime = []
        tempMapData.map((data) => {
            if (data.type === 'datetime' || data.type === 'date') {
                if (value[data.name]) {
                    value[data.name] = moment(
                        value[data.name],
                        'MM-DD-YYYY h:mm a'
                    ).format()
                    value.customdatetime.push(data.name)
                }
            }
        })

        if (data?.status === 'use') {
            value.id = 0
        }

        if (value.title === '') {
            setAlert('Title is a Required field', 'error')
        } else {
            const status = marketStatus ? marketStatus : value.market_status
            props.actionFunction(value, status)
        }
    }

    const formik = useFormik({
        initialValues: initialValues,
        validateOnBlur: false,
        validationSchema: Yup.object().shape({ ...validationArray }, [
            'auction',
            'buynow',
        ]),
        enableReinitialize: true,
        onSubmit: (values) => {
            formSubmitFunction(values)
        },
    })

    useEffect(() => {
        if (props.handleMapDataValue) {
            props.handleMapDataValue(mapDataValue)
        }
    }, [mapDataValue, mapDataValue1, mapDataValue2])

    useEffect(() => {
        if (props.additionalFormikUpdate) {
            console.log('is it coming')
            if (props.setrprice) {
                console.log('is it coming')
                formik.values.rprice = formik.values.sprice
                props.additionalFormikUpdate(formik.values)
            } else {
                props.additionalFormikUpdate(formik.values)
            }
        }
    }, [formik.values, props?.setrprice])

    // useEffect(() => {
    //     if (props.resetMapData) {
    //         if (props.mapDataValue) {
    //             setMapDataValue(props.mapDataValue)
    //             props.setResetMapData(false)
    //         }
    //     }
    // }, [props.resetMapData, props.mapDataValue])

    const subStateOptions = (data) => {
        let valueDrop = allStates
            .filter(
                (state) =>
                    (formik.values.country
                        ? formik.values.country.indexOf(state.countryCode) !==
                          -1
                        : global.defaultCountry.indexOf(state.countryCode) !==
                          -1) &&
                    global.ignoreStates.indexOf(state.isoCode) === -1
            )
            .map((buscat) => {
                let busCategoryChanged = {}
                busCategoryChanged.show = buscat.name
                busCategoryChanged.value = buscat.isoCode
                return busCategoryChanged
            })
        return valueDrop
    }

    const subCityOptions = (data) => {
        console.log(formik.values, 'formikk')
        let valueDrop = allCities
            .filter((state) =>
                formik.values?.country && formik.values?.state
                    ? formik.values.country.indexOf(state.countryCode) !== -1 &&
                      formik.values.state.indexOf(state.stateCode) !== -1
                    : formik.values.state
                    ? global.defaultCountry.indexOf(state.countryCode) !== -1 &&
                      formik.values.state.indexOf(state.stateCode) !== -1
                    : false
            )
            .map((buscat) => {
                let busCategoryChanged = {}
                busCategoryChanged.show = buscat.name
                busCategoryChanged.value = buscat.name
                return busCategoryChanged
            })
        console.log(valueDrop, 'dropcity')
        return valueDrop
    }

    const subLevelOptions = (data) => {
        let valueDrop = []
        console.log(data, 'subselect')
        valueDrop = alldata_all_dropdown
            .filter((subcat) => {
                if (
                    formik.values[data.sub_field] &&
                    parseInt(subcat.level, 10) === parseInt(data.sub_level, 10)
                ) {
                    if (
                        parseInt(subcat.active, 10) === 1 ||
                        (formik.values[data.name] &&
                            formik.values[data.name] === subcat.id)
                    ) {
                        if (data.diff_value) {
                            let mainId = alldata_all_dropdown.filter(
                                (item) =>
                                    item.value === formik.values[data.sub_field]
                            )[0]
                            console.log(mainId, 'mainId')
                            return (
                                parseInt(subcat.level_id, 10) ===
                                parseInt(mainId?.id, 10)
                            )
                        } else {
                            return (
                                parseInt(formik.values[data.sub_field], 10) ===
                                parseInt(subcat.level_id, 10)
                            )
                        }
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            })
            .map((subcat) => {
                console.log(subcat, 'subb')
                let subCategoryChanged = {}
                subCategoryChanged.show = subcat.description
                subCategoryChanged.value = data.diff_value
                    ? subcat.value
                    : subcat.id
                return subCategoryChanged
            })
        if (valueDrop.length) {
            return valueDrop
        } else {
            return valueDrop
        }
    }

    const mapDataValueRef = useRef(mapDataValue)
    const errorArray = useRef([])
    useEffect(() => {
        mapDataValueRef.current = mapDataValue
    })
    useEffect(() => {
        let charityFetch = {
            primaryTable: 'fundraisers',
            limit: 500,
        }
        searchTableFetch(charityFetch, 'charityDropdown')
    }, [])

    useEffect(() => {
        if (
            search_fetch_data &&
            search_fetch_data.records &&
            search_fetch_data.records.length &&
            search_fetch_data.from === 'charityDropdown'
        ) {
            const filteredData = search_fetch_data.records.map((item) => {
                return { value: item.id, show: item.Fundraisername }
            })
            console.log('rama testing', filteredData.length, search_fetch_data)
            setCharityOption(filteredData)
        }
    }, [search_fetch_data])

    useEffect(() => {
        if (mapDataValueRef.current.length) {
            let tempMapData = mapDataValueRef.current
            tempMapData.map((data) => {
                if (
                    data.type === 'select' &&
                    parseInt(data.sub_select, 10) === 1
                ) {
                    if (parseInt(data.sub_level, 10) > 0) {
                        data.options = subLevelOptions(data)
                    }
                }
                if (data.type === 'select' && data.name === 'state') {
                    data.options = subStateOptions(data)
                }
                if (data.type === 'select' && data.name === 'city') {
                    data.options = subCityOptions(data)
                }
                    if (data.type === 'select' && data.name === 'charity_account') {
                        data.type = 'autocomplete'
                        data.options = charityOption
                    }
                if (
                    data.type === 'multiselect' &&
                    parseInt(data.sub_select, 10) === 1
                ) {
                    if (parseInt(data.sub_level, 10) > 0) {
                        data.options = subLevelOptions(data)
                    }
                }
            })
        }
    }, [formik.values])

    useEffect(() => {
        setValueLoaded(false)
        setIsLoading(true)
        setInitialValues({})
        setInitialEmptyValues({})
        setMapDataValue([])
        setMapDataValue1([])
        setMapDataValue2([])
        let custom = props.customInitialValues

        if (arrayValue?.length) {
            let mapValueArray = arrayValue
            let { tempMapData, show, calculateValues } = initialFunction(
                mapValueArray,
                alldata_all_dropdown,
                subLevelOptions,
                allCountries,
                subStateOptions,
                subCityOptions,
                allLocations
            )
            console.log(show, 'initail values')
            setInitialValues({ ...show, ...custom })
            setInitialEmptyValues({ ...show, ...custom })

            setMapDataValue(tempMapData)
            if (props.customInBetween) {
                const midIndex = Math.floor(props.customInBetween)
                const firstHalf = tempMapData.slice(0, midIndex)
                const secondHalf = tempMapData.slice(midIndex)
                setMapDataValue1(firstHalf)
                setMapDataValue2(secondHalf)
            }
            setCalculateFields(calculateValues)

            setTimeout(() => {
                if (tempMapData.length) {
                    setValueLoaded(true)
                    setIsLoading(false)
                    setReload(!reload)
                }
            }, 1000)
        }
    }, [arrayValue])

    useEffect(() => {
        setValidationArray({})

        if (arrayValue?.length) {
            let mapValueArray = arrayValue
            let handle = validationFunction(
                mapValueArray,
                props.customValidation,
                t
            )
            setValidationArray(handle)
        }
    }, [arrayValue, props.customValidation])

    const resetForm = () => {
        setInitialValues(initialEmptyValues)
        if (
            props.customInitialValues &&
            props.customInitialValues.itemPropStep > 0
        ) {
            SetArrayItemTrigger(true)
        } else {
            SetArrayItemTrigger(false)
        }
        setReload(!reload)
    }

    const handleSingleProject = (edit_value) => {
        console.log('handleCominggg')
        if (edit_value) {
            if (edit_value.record) {
                const auction = edit_value.record
                let objectPush = editValue(arrayValue, auction)
                if (props.customDynamicInput) {
                    objectPush.itemPropStep =
                        objectPush?.multiArrayObject?.length
                }
                console.log(objectPush, 'onkkk')
                setInitialValues(objectPush)
                setReload(!reload)
                if (Object.keys(objectPush).length) {
                    setTimeout(() => {
                        SetArrayItemTrigger(true)
                    }, 1000)
                }
            }
        }
    }

    useEffect(() => {
        if (
            (data?.id &&
                (data?.status === 'edit' || data?.status === 'editTemplate')) ||
            data?.status === 'duplicate'
        ) {
            formik.values.id = data?.id
            if (props.permission) {
                formik.values.is_permission_not_required = props.permission
            } else {
                delete formik.values.is_permission_not_required
            }
            props.editFunction(formik.values)
        } else if (data?.status === 'use') {
            formik.values.id = data.id
            props.template_GetSingleValue(formik.values)
        } else if (data?.status === 'new') {
            resetForm()
        }
    }, [data?.id, props.permission])

    useEffect(() => {
        if (Object.keys(initialEmptyValues).length !== 0) {
            resetForm()
        }
    }, [initialEmptyValues])

    useEffect(() => {
        if (
            (data?.id &&
                (data?.status === 'edit' || data?.status === 'editTemplate')) ||
            data?.status === 'duplicate'
        ) {
            handleSingleProject(props.editValue)
            setReload(!reload)
        } else if (data?.status === 'use') {
            handleSingleProject(props.template_SingleValue)
            console.log('useedit', props.template_SingleValue)
            setReload(!reload)
        } else if (data?.status === 'new' || data?.status === 'newTemplate') {
            if (props.showasin || props.homeDepot) {
                console.log(props.all_products, data.id, 'puuuu')
                if (Object.keys(props.all_products.record).length) {
                    handleSingleProject(props.all_products)
                    setReload(!reload)
                }
            } else {
                resetForm()
            }
        }
    }, [props.editValue, data, props.all_products, props.template_SingleValue])

    const formSubmit = (type, status) => {
        setAdditionalSubmit(status)
        formik.setFieldValue('market_status', status)
        if (type === 'submit' || props.draftValidation) {
            if (props.validationPopup) {
                errorArray.current = []
                if (Object.keys(formik.errors).length) {
                    for (const key in formik.errors) {
                        if (formik.errors.hasOwnProperty(key)) {
                            mapDataValue.forEach((e) => {
                                if (e.name == key)
                                    errorArray.current.push({
                                        ...e,
                                        errorVal: formik.errors[key],
                                    })
                            })
                        }
                    }
                    setToggleDialogErr(true)
                }
                formik.submitForm()
            } else {
                formik.submitForm()
            }
        } else {
            formSubmitFunction(formik.values, status)
        }
    }

    const dynamicOprator = (data, operator) => {
        let valueTemp = 0
        switch (operator) {
            case '*':
                valueTemp = data.reduce((a, b) => {
                    return formik.values[a] * formik.values[b]
                })
                break
            case '+':
                valueTemp = data.reduce((a, b) => {
                    return Number(formik.values[a]) + Number(formik.values[b])
                })
                break
            case '-':
                valueTemp = data.reduce((a, b) => {
                    return Number(formik.values[a]) - Number(formik.values[b])
                })
                break
            case '/':
                valueTemp = data.reduce((a, b) => {
                    return Number(formik.values[a]) / Number(formik.values[b])
                })
                break
            case '=':
                valueTemp = formik.values[data]
                break
            default:
                break
        }

        return valueTemp
    }
    useEffect(() => {
        if (calculateFields.length) {
            calculateFields.map((buscat) => {
                formik.values[buscat.name] = dynamicOprator(
                    buscat.calculate_value.value,
                    buscat.calculate_value.operator
                )
            })
        }
    }, [formik.values])

    useEffect(() => {
        if (data?.status === 'edit' && data.id && props.changePassword) {
            props.formikPassword.values.id = data.id
            props.formikPassword.values.new_password = ''
            props.formikPassword.values.confirm_password = ''
        }
    }, [data])

    const changeDialogStatusErr = () => {
        setToggleDialogErr(!toggleDialogErr)
    }

    return (
        <>
            {isLoading ? (
                <div className="fspLoader">
                    <Loaders isLoading={isLoading} />
                </div>
            ) : valueLoaded ? (
                <div className="addUserModal addListing">
                    {Object.keys(formik.values).length !== 0 ? (
                        <>
                            <form
                                onSubmit={formik.handleSubmit}
                                autoComplete="nofill"
                            >
                                {props.customInBetween ? (
                                    <>
                                        <div className="row">
                                            {mapData({
                                                formik,
                                                data: mapDataValue1,
                                            })}
                                        </div>
                                        {props.customDynamicInput ? (
                                            <>
                                                <div className="row">
                                                    <ItemPropsList
                                                        formik={formik}
                                                        trigger={
                                                            arrayItemTrigger
                                                        }
                                                        errors={
                                                            itemPropsArrayErrors
                                                        }
                                                        resetTrigger={
                                                            SetArrayItemTrigger
                                                        }
                                                        alldata_all_dropdown={
                                                            alldata_all_dropdown
                                                        }
                                                        allCountries={
                                                            allCountries
                                                        }
                                                        subStateOptions={
                                                            subStateOptions
                                                        }
                                                        subCityOptions={
                                                            subCityOptions
                                                        }
                                                        allLocations={
                                                            allLocations
                                                        }
                                                        isDelete={
                                                            props.isDelete
                                                        }
                                                    />
                                                </div>
                                                <div className="row">
                                                    <div className="col-3 moreBtnPRT">
                                                        <Button
                                                            className="addMore"
                                                            type="button"
                                                            onClick={() =>
                                                                onAddItemArrayHandle(
                                                                    1
                                                                )
                                                            }
                                                        >
                                                            <span className="material-icons">
                                                                add_circle
                                                            </span>
                                                            {t('Add Damage')}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}

                                        {mapDataValue2.length ? (
                                            <div className="row">
                                                {mapData({
                                                    formik,
                                                    data: mapDataValue2,
                                                })}
                                            </div>
                                        ) : null}
                                    </>
                                ) : (
                                    <>
                                        <div className="row">
                                            {mapData({
                                                formik,
                                                data: mapDataValue,
                                            })}
                                        </div>
                                        {props.customDynamicInput ? (
                                            <>
                                                <div className="row">
                                                    <ItemPropsList
                                                        formik={formik}
                                                        trigger={
                                                            arrayItemTrigger
                                                        }
                                                        errors={
                                                            itemPropsArrayErrors
                                                        }
                                                        resetTrigger={
                                                            SetArrayItemTrigger
                                                        }
                                                        alldata_all_dropdown={
                                                            alldata_all_dropdown
                                                        }
                                                        allCountries={
                                                            allCountries
                                                        }
                                                        subStateOptions={
                                                            subStateOptions
                                                        }
                                                        subCityOptions={
                                                            subCityOptions
                                                        }
                                                        allLocations={
                                                            allLocations
                                                        }
                                                        isDelete={
                                                            props.isDelete
                                                        }
                                                    />
                                                </div>
                                                <div className="row">
                                                    <div className="col-12 moreBtnPRT">
                                                        <Button
                                                            className="addMore"
                                                            type="button"
                                                            onClick={() =>
                                                                onAddItemArrayHandle(
                                                                    1
                                                                )
                                                            }
                                                        >
                                                            <span className="material-icons">
                                                                add_circle
                                                            </span>
                                                            {t('Add Damage')}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                    </>
                                )}

                                <div className="actionButton d-flex justify-content-center align-items-center flex-wrap">
                                    <SecondaryButton
                                        id="baseAction_cancel"
                                        label="cancel"
                                        onClick={props.cancelFunction}
                                    />
                                    {props.buttonAction.map((data, index) => (
                                        <>
                                            {data.style === 'primary' ? (
                                                <>
                                                    <PrimaryButton
                                                        id="base_submit"
                                                        onClick={() => {
                                                            formSubmit(
                                                                data.type,
                                                                data.additionalValue
                                                            )
                                                        }}
                                                        type="button"
                                                        label={data.label}
                                                    />
                                                </>
                                            ) : data.style === 'secondary' ? (
                                                <SecondaryButton
                                                    id="baseAction_draft"
                                                    onClick={() => {
                                                        formSubmit(
                                                            data.type,
                                                            data.additionalValue
                                                        )
                                                    }}
                                                    type="button"
                                                    label={data.label}
                                                />
                                            ) : null}
                                        </>
                                    ))}
                                </div>
                            </form>
                            {data?.status === 'edit' && props.changePassword ? (
                                <>
                                    <form
                                        onSubmit={
                                            props.formikPassword.handleSubmit
                                        }
                                        autoComplete="nofill"
                                    >
                                        <h2 className="dashTitle">
                                            CHANGE PASSWORD
                                        </h2>
                                        <div className="row">
                                            {mapData({
                                                formik: props.formikPassword,
                                                data: props.passwordChange,
                                            })}
                                        </div>
                                        <div className="actionButton d-flex justify-content-center align-items-center flex-wrap">
                                            <PrimaryButton
                                                id="employee_submit"
                                                type="submit"
                                                label="Submit"
                                            />
                                        </div>
                                    </form>
                                </>
                            ) : null}
                        </>
                    ) : null}
                </div>
            ) : null}
            <CustomDialog
                title={t('Form_Validation')}
                open={toggleDialogErr}
                function={changeDialogStatusErr}
                handleClose={changeDialogStatusErr}
                className="validationErrorDialog"
            >
                <ol>
                    {errorArray.current.map((e) =>
                        e.label != ' ' ? (
                            <li>
                                {e.label}:<span>{e.errorVal}</span>
                            </li>
                        ) : null
                    )}
                </ol>
            </CustomDialog>
        </>
    )
}

export default BaseActionPage
