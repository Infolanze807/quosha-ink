import styles from "./index.module.scss";
import { MdArrowOutward } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { collectionImages } from "../../../data/images";
import { motion } from "framer-motion";
// import { useState } from "react";

const Collections = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/catalog/search?query=${query}`);
    }
  };

  return (
    <section className={styles.section}>
      <div className={`${styles.container} main-container`}>
        <p className={styles.section_title_top}>Our Collections</p>
        <div className={styles.productList}>
          <div className={styles.collectionContainer}>
            {collectionImages.map((item, id) => (
              <div 
                key={id} 
                className={styles["div" + (id + 1)]}
                onClick={() => handleSearch(item.name)}
              >
                <img
                  srcSet={item.path}
                  className={`${styles.image}`}
                  loading="lazy"
                />
                <motion.div
                  key="cart"
                  whileHover={{ zoom: 1.05 }}
                  style={{ height: "100%" }}
                >
                  <div className={styles.iconCcontainer}>
                    <MdArrowOutward className={styles.icon} />
                  </div>
                </motion.div>
                <div className={styles.title}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collections;
