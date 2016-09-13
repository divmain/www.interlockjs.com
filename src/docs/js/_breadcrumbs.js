export function buildBreadcrumb (nodes, selector, onClick) {
  window.requestAnimationFrame(() => {
    const breadcrumb = document.createDocumentFragment();

    nodes.forEach((node, idx) => {
      const domNode = document.createElement("a");
      domNode.className = "breadcrumb-item";
      domNode.addEventListener("click", ev => {
        ev.preventDefault();
        onClick(node);
      });
      domNode.innerHTML = node.data.name;
      breadcrumb.appendChild(domNode);

      // Don't add a separator for the last breadcrumb item.
      if (idx !== nodes.length - 1) {
        const separator = document.createElement("i");
        separator.className = "breadcrumb-separator ion-android-arrow-dropright";
        breadcrumb.appendChild(separator);
      }
    });

    const parent = document.querySelector(selector);
    parent.innerHTML = "";
    parent.appendChild(breadcrumb);
  });
}
