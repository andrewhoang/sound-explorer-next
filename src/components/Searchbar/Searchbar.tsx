import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import useSearch from "@/hooks/useSearch";

import { SearchbarProps, SearchResult } from "./Searchbar.props";

import styles from "./Searchbar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import debounce from "lodash.debounce";
import * as R from "ramda";

const Searchbar = (props: SearchbarProps): JSX.Element => {
  const { placeholder, width } = props;

  const { results, search, setSearch } = useSearch();
  const router = useRouter();

  const cssInlineStyles: React.CSSProperties = {
    ["--search-width" as string]: `${width}px`,
  };

  const handleSearchChange = debounce((value: string) => {
    setSearch(value);
  }, 1000);

  const handleSearchSelect = (id: string, type: string) => {
    if (type === "artist") {
      router.push({
        pathname: "/search/[id]",
        query: { id },
      });
    } else {
      router.push(
        {
          pathname: "/playlist",
          query: {
            selected: id,
            type: "track",
          },
        },
        "/playlist"
      );
    }
  };

  return (
    <form
      className={styles.searchbar}
      style={cssInlineStyles}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <input
        className={styles.searchInput}
        placeholder={placeholder}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      <div className={styles.searchIcon}>
        <FontAwesomeIcon icon={faSearch} />
      </div>

      {search && !R.isEmpty(results) && (
        <div className={styles.searchResults}>
          {!R.isEmpty(results.artists) && !R.isEmpty(results.tracks) ? (
            Object.keys(results).map((key, index) => (
              <div key={index} className={styles.category}>
                <div className={styles.categoryLabel}>{key}</div>
                {/* @ts-ignore */}
                {results[key]
                  .filter((result: SearchResult) => result.image)
                  // @ts-ignore
                  .map((result: SearchResult, index) => (
                    <button
                      key={index}
                      className={styles.result}
                      onClick={() => handleSearchSelect(result.id, result.type)}
                    >
                      <Image
                        className={styles.resultImage}
                        src={result.image?.url}
                        alt={result.title}
                        width={result.image?.width}
                        height={result.image?.width}
                      />
                      <div className={styles.searchContent}>
                        <strong>{result.title}</strong>
                        <p className={styles.searchContentDescription}>
                          {result.description}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      )}
    </form>
  );
};

export default Searchbar;
