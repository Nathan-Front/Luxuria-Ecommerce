//shared intersection
export function sectionsInterSections() {
  const interSectItems = document.querySelectorAll(".intersect-first");
  if (!interSectItems.length) return;
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("intersect");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    },
  );
  interSectItems.forEach((item) => observer.observe(item));
}

export function sectionsInterSectionsSecond() {
  const interSectItems = document.querySelectorAll(".intersect-left");
  if (!interSectItems.length) return;
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("intersect-second");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
    },
  );
  interSectItems.forEach((item) => observer.observe(item));
}

export function sectionsInterSectionsThird() {
  const interSectItems = document.querySelectorAll(".intersect-right");
  if (!interSectItems.length) return;
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("intersect-third");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
    },
  );
  interSectItems.forEach((item) => observer.observe(item));
}
