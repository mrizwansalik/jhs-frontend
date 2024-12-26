/*eslint-disable */
import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import UpdateButton from '../../../components/button/Button';
import { config as mainConfig } from '../../../config/config';
import { countryListAllIsoData, languageOptions, timeZoneOptions } from 'components/select';

const BasicSetting = () => {
    const dispatch = useDispatch();

    const currUser = useSelector((state) => state.profile.profile);
    const user = JSON.parse(localStorage.getItem('auth'));
    const [uploadImage, setUploadImage] = useState({ preview: "", raw: "" });
    
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ mode: 'all' });

    const updateHandle = (formData) => {
        const appendForm = new FormData();
        appendForm.append("file", uploadImage.raw);
        appendForm.append("country",formData.country);
        appendForm.append("department",formData.department);
        appendForm.append("first_name",formData.first_name);
        appendForm.append("institute",formData.institute);
        appendForm.append("language",formData.language);
        appendForm.append("last_name",formData.last_name);
        appendForm.append("middle_name",formData.middle_name);
        appendForm.append("occupation",formData.occupation);
        appendForm.append("phone",formData.phone);
        appendForm.append("time_zone",formData.time_zone);

        const url = import.meta.env.VITE_REACT_APP_API_URL + 'profile/updateProfile';
        axios.post(url, appendForm, {
            headers: {
                'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              ...mainConfig.data().defaultHeaders,
            }
          })
          .then(response => {
            dispatch({ type: 'SET_PERSONAL_PROFILE', payload: response.data.data });
          })
          .catch(error => {
            console.error(error);
          });
    }

    
  const handleImage = (e) => {
    if (e.target.files.length) {
      setUploadImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  }
  if(!currUser){
    return "Please Wait..."
  }

    return (
        <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
            <div className="card-body">
                <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3">
                    <i className="ai-user text-primary lead pe-1 me-2" />
                    <h2 className="h4 mb-0">Basic info</h2>
                </div>
                <div className="d-flex align-items-center">
                    
                    <div className="dropdown">
                        
                        <a className="d-flex flex-column justify-content-end position-relative overflow-hidden rounded-circle bg-size-cover bg-position-center flex-shrink-0" href="#" data-bs-toggle="dropdown" aria-expanded="false" style={{ width: '80px', height: '80px', backgroundImage: `url(${uploadImage.preview ? uploadImage.preview :`${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${currUser?.file}`})` }}>
                        <span className="d-block text-light text-center lh-1 pb-1" style={{ backgroundColor: 'rgba(0,0,0,.5)' }}><i className="ai-camera" /></span>
                        </a>
                        <label htmlFor="upload-avatar-pic">
                        <div className="dropdown-menu my-1">
                            <a className="dropdown-item fw-normal" >
                            <i className="ai-camera fs-base opacity-70 me-2 pointer" />Upload new photo</a>  
                        </div>
                        </label>
                        <input id="upload-avatar-pic" type="file" hidden {...register("file")} onChange={handleImage} />
                    </div>
                    <div className="ps-3">
                        <h3 className="h6 mb-1">Profile picture</h3>
                        <p className="fs-sm text-muted mb-0">PNG or JPG no bigger than 1000px wide and tall.</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit(updateHandle)}>
                    <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                        <div className="col-sm-4">
                            <label className="form-label" htmlFor="fn">First name</label>
                            <input className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}   {...register('first_name', {
                                required: 'First name is required',
                                value: currUser?.first_name
                            })} type="text" id="fn"  />
                            <div className="invalid-feedback">{errors.first_name?.message}</div>
                        </div>
                        <div className="col-sm-4">
                            <label className="form-label" htmlFor="mn">Middle name</label>
                            <input className={`form-control ${errors.middle_name ? 'is-invalid' : ''}`}   {...register('middle_name', {
                                value: currUser?.middle_name
                            })} type="text" id="mn" defaultValue={currUser?.middle_name} />
                            <div className="invalid-feedback">{errors.middle_name?.message}</div>
                        </div>
                        <div className="col-sm-4">
                            <label className="form-label" htmlFor="ln">Last name</label>
                            <input className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}   {...register('last_name', {
                                required: 'Last name is required',
                                value: currUser?.last_name
                            })} type="text" defaultValue={currUser?.last_name} id="ln" />
                            <div className="invalid-feedback">{errors.last_name?.message}</div>
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label" htmlFor="phone">Phone</label>
                            <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                {...register('phone', {
                                    value: currUser?.phone
                                })}
                                type="text" id="phone" />
                            <div className="invalid-feedback">{errors.phone?.message}</div>
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label" htmlFor="country">Country</label>
                            <select className={`form-select ${errors.country ? 'is-invalid' : ''}`}
                                {...register('country', {
                                    value: currUser?.country,
                                    defaultValue: currUser?.country
                                })} id="country">
                                    {
                                        countryListAllIsoData.map((country) => {
                                            return <option key={`${country.name}_Country_Item` } value={`${country.code}`}>{country.name}</option>
                                        })
                                    }
                            </select>
                            <div className="invalid-feedback">{errors.country?.message}</div>
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label" htmlFor="language">Language</label>
                            <select className={`form-select ${errors.language ? 'is-invalid' : ''}`}
                                {...register('language', {
                                    value: currUser?.language,
                                    defaultValue: currUser?.language
                                })} id="language">
                                {
                                    languageOptions.map((language) => {
                                        return <option key={`${language.label}_Language_Item` } value={`${language.value}`}>{language.label}</option>
                                    })
                                }
                            </select>
                            <div className="invalid-feedback">{errors.language?.message}</div>
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label" htmlFor="time_zone">Time zone</label>
                            <select className={`form-select ${errors.time_zone ? 'is-invalid' : ''}`}
                                {...register('time_zone', {
                                    value: currUser?.time_zone,
                                    defaultValue: currUser?.time_zone
                                })} id="time_zone">
                                {
                                    timeZoneOptions.map((timeZone) => {
                                        return <option key={`${timeZone.label}_Language_Item` } value={`${timeZone.value}`}>{timeZone.label}</option>
                                    })
                                }
                            </select>
                            <div className="invalid-feedback">{errors.time_zone?.message}</div>
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label" htmlFor="occupation">Occupation <span className="text-muted">(optional)</span></label>
                            <input className={`form-control ${errors.occupation ? 'is-invalid' : ''}`}
                                {...register('occupation', {
                                    value: currUser?.occupation
                                })}
                                type="text" id="occupation" />
                            <div className="invalid-feedback">{errors.occupation?.message}</div>
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label" htmlFor="department">Department <span className="text-muted">(optional)</span></label>
                            <input className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                                {...register('department', {
                                    value: currUser?.department
                                })}
                                type="text" id="department" />
                            <div className="invalid-feedback">{errors.department?.message}</div>
                        </div>
                        <div className="col-sm-12">
                            <label className="form-label" htmlFor="institute">Institute <span className="text-muted">(optional)</span></label>
                            <input className={`form-control ${errors.institute ? 'is-invalid' : ''}`}
                                {...register('institute', {
                                    value: currUser?.institute
                                })}
                                type="text" id="institute" />
                            <div className="invalid-feedback">{errors.institute?.message}</div>
                        </div>
                        <div className="col-12">
                            <label className="form-label" htmlFor="bio">Bio</label>
                            <textarea className="form-control" rows={5} placeholder="Add a bio" id="bio" />
                        </div>
                        <div className="col-12 d-flex justify-content-end pt-3">
                            <UpdateButton className='btn btn-primary ms-3' title="Save Changes" type='submit' />
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default BasicSetting;