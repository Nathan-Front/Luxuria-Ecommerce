//For loading and spinner during fetch of data
export function setSectionLoading(section, isLoading) {
  if (!section) return;
  const loading = section.querySelector(".product-loading");
  if (loading) {
    loading.hidden = !isLoading;
  }
}
