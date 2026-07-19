"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, Tick01Icon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/contexts/AuthContext";
import type { ReviewData } from "@/types";

interface Props {
  targetType: "product" | "service" | "store";
  targetId: string;
}

export default function ReviewSection({ targetType, targetId }: Props) {
  const { firebaseUser, mongoUser } = useAuth();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [myRating, setMyRating] = useState(5);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = () => {
    fetch(`/api/reviews?targetType=${targetType}&targetId=${targetId}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.items || []);
        setAvgRating(data.avgRating || 0);
        setRatingCount(data.ratingCount || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [targetType, targetId]);

  const submitReview = async () => {
    if (!myComment.trim() || !mongoUser?.id) return;
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: mongoUser.id,
          targetType,
          targetId,
          rating: myRating,
          comment: myComment.trim(),
        }),
      });
      setMyComment("");
      setMyRating(5);
      setShowForm(false);
      fetchReviews();
    } catch {}
    setSubmitting(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-text-primary">Reviews</h3>
          {!loading && ratingCount > 0 && (
            <p className="text-xs text-text-muted">
              <span className="font-medium text-warning">{avgRating.toFixed(1)}</span> · {ratingCount} review{ratingCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {firebaseUser && (
          <button onClick={() => setShowForm(!showForm)}
            className="rounded-lg border border-border/50 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary">
            {showForm ? "Cancel" : "Write Review"}
          </button>
        )}
      </div>

      {showForm && (
        <div className="rounded-xl border border-border/50 bg-surface/50 p-4 space-y-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setMyRating(s)} className="transition-transform hover:scale-110">
                <HugeiconsIcon icon={StarIcon} size={18} className={s <= myRating ? "text-warning" : "text-border"} />
              </button>
            ))}
          </div>
          <textarea value={myComment} onChange={(e) => setMyComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3} maxLength={1000}
            className="w-full resize-none rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
          <div className="flex justify-end">
            <button onClick={submitReview} disabled={!myComment.trim() || submitting}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-30">
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted">No reviews yet</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="rounded-xl border border-border/30 bg-surface/30 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {typeof r.userId === "object" ? ((r.userId as any).name?.[0] || "U") : "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {typeof r.userId === "object" ? (r.userId as any).name || "User" : "User"}
                    </p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <HugeiconsIcon key={i} icon={StarIcon} size={12} className={i < r.rating ? "text-warning" : "text-border/50"} />
                      ))}
                    </div>
                  </div>
                </div>
                {r.verifiedPurchase && (
                  <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                    <HugeiconsIcon icon={Tick01Icon} size={10} /> Verified
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-text-secondary">{r.comment}</p>
              {r.ownerReply && (
                <div className="mt-3 rounded-lg bg-primary/5 p-3 text-xs text-text-secondary">
                  <span className="font-medium text-text-primary">Owner reply:</span>
                  <p className="mt-1">{r.ownerReply.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
