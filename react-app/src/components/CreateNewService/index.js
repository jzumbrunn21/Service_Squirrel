import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createServiceThunk } from "../../store/services";
import "./CreateNewService.css";

const CreateNewService = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  // const [providerName, setProviderName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [price, setPrice] = useState(0);
  const [lengthEstimate, setLengthEstimate] = useState("");
  const [category, setCategory] = useState("Lawn Service");

  const [errors, setErrors] = useState({});
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title || title.length < 6 || title.length > 50) {
      newErrors.title =
        "Title is required and must be between 6 and 50 characters ";
    }

    if (!description || description.length < 1 || description.length > 2000) {
      newErrors.description =
        "Description is required and must be between 1 and 2000 characters ";
    }

    const validUrlEndings = [".jpg", ".jpeg", ".png"];
    if (
      !url ||
      !validUrlEndings.some((ending) => url.toLowerCase().endsWith(ending))
    ) {
      newErrors.url =
        "Image url is required and must end in .jpg, .jpeg, or .png";
    }
    if (!price || price < 1) {
      newErrors.price = "Price is required";
    }
    if (!lengthEstimate || lengthEstimate < 1) {
      newErrors.lengthEstimate = "Length Estimate is required";
    }
    if (!category) {
      newErrors.category = "Category is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const service_title = title;
    const service_description = description;
    const service_price = price;
    const service_length_est = lengthEstimate;
    const service_category = category;

    const serviceData = {
      service_title,
      service_description,
      url,
      service_price,
      service_length_est,
      service_category,
    };

    const createdService = await dispatch(createServiceThunk(serviceData));
    if (createdService) {
      history.push(`/services/${createdService.id}`);
    } else {
      return "Error"; //Placeholder
    }
  };

  return (
    <div className="create-service-container">
      <h1>Create Your New Service</h1>
      <form onSubmit={handleSubmit}>
        <div className="create-service-title">
          <label>
            What's your service called?
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </label>
        </div>
        <div className="create-service-description">
          <label>
            Service Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </label>
        </div>
        <div className="create-service-url">
          <label>
            ImageUrl
            <textarea value={url} onChange={(e) => setUrl(e.target.value)} />
            {errors.url && <span className="error">{errors.url}</span>}
          </label>
        </div>
        <div className="create-service-price">
          <label>
            Price (per hour)
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && <span className="error">{errors.price}</span>}
          </label>
        </div>
        <div className="create-service-length">
          <label>
            Service Length Estimate
            <input
              type="number"
              value={lengthEstimate}
              onChange={(e) => setLengthEstimate(e.target.value)}
            />
            {errors.lengthEstimate && (
              <span className="error">{errors.lengthEstimate}</span>
            )}
          </label>
        </div>
        <div className="create-service-category">
          <label>
            Service Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Lawn Service">Lawn Service</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Moving">Moving</option>
            </select>
            {/* <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          /> */}
            {errors.category && (
              <span className="error">{errors.category}</span>
            )}
          </label>
        </div>
        <button type="submit">Post Your Service</button>
      </form>
    </div>
  );
};

export default CreateNewService;
