import { useContext, useEffect} from "react";
import { useForm } from "react-hook-form";
import { SidebarContext } from "../context/SidebarContext";
import { notifyError, notifySuccess } from "../utils/toast";
import FaqServices from './../services/FaqServices';

const useFaqSubmit = (id) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate } = useContext(SidebarContext);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ question, answer }) => {
    const faqData = {
      question: question,
      answer: answer
    };
    if (id) {
      FaqServices.updateFaq(id, faqData)
        .then((res) => {
          console.log(res.data);
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeDrawer();
    } else {
      FaqServices.addFaqs(faqData)
        .then((res) => {
          // console.log(res.data);
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeDrawer();
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setValue("question");
      setValue("answer");
      clearErrors("type");
      return;
    }
    if (id) {
      FaqServices.getFaqById(id)
        .then((res) => {
          if (res) {
            setValue("question", res.question);
            setValue("answer", res.answer);
          }
        })
        .catch((err) => {
          notifyError("There is a server error!");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue, isDrawerOpen]);
  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
  };
};

export default useFaqSubmit;
