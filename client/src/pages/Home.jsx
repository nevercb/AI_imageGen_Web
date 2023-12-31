import React, { useState, useEffect } from "react";

import { Load, Card, FormField } from "../components";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0)
    return data.map((post) => {
      return <Card key={post._id} {...post} />;
    });
  return (
    <h2
      className="mt-5 font-bold
    text-[#6449ff] text-x1 uppercase"
    >
      {title}
    </h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);

  const [searchText, setSearchText] = useState("");

  const [searchResults, setSearchResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:8080/api/v1/post", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const result = await response.json();

          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    setLoading(true);
    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );

        setSearchResults(searchResults);
        setLoading(false);
      }, 200)
    );
  };

  return (
    <div>
      <section className="max-w-7x1 mx-auto">
        <div>
          <h1
            className="font-serif font-extrabold text-cyan-950/75 hover:text-fuchsia-600 text-[32px]
          "
          >
            AI Image Community
          </h1>
          <p
            className="mt-2 text-[#666e75] text-[14px]
          max-w[500px]"
          >
            {" "}
            一个可自定义的AI生成图片社区(driven by openai)，
            点击右上角Create创建您的第一张图片。
          </p>
        </div>
        <div className="mt-16">
          <FormField
            labelName="Search by keywords"
            type="text"
            name="text"
            placeholder="输入关键词搜索"
            value={searchText}
            handleChange={handleSearchChange}
          />
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="flex jusitfy-center items-center">
              <Load />
            </div>
          ) : (
            <>
              {searchText && (
                <h2
                  className="font-medium text-[#666e75] text-x1
              mb-3"
                >
                  Showing results for{" "}
                  <span className="text-[#222328]">{searchText}</span>
                </h2>
              )}
              <div
                className="grid lg:grid-cols-4 sm:grid-cols-3
              xs:grid-cols-2 grid-cols-1 gap-3"
              >
                {/* grid只用于展示图片 */}
                {searchText ? (
                  <RenderCards
                    data={searchResults}
                    title="No search results found"
                  />
                ) : (
                  <RenderCards data={allPosts} title="No posts found" />
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
