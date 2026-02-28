// src/components/layout/Showcase.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";
import { getImageUrl, getCollections } from "@/data/catalogData";

// Import images
import heroImage from "@/assets/hero-living-room.jpg";
import craftsmanshipImage from "@/assets/craftsmanship.jpg";
import armchairImage from "@/assets/product-armchair.jpg";
import diningTableImage from "@/assets/product-dining-table.jpg";
import lampImage from "@/assets/product-lamp.jpg";

const featuredProducts = [
	{
		id: "1",
		title: "Aria Lounge Chair",
		slug: "aria-lounge-chair",
		price: 3450,
		image: armchairImage,
		category: "Seating",
	},
	{
		id: "2",
		title: "Tavola Dining Table",
		slug: "tavola-dining-table",
		price: 8900,
		image: diningTableImage,
		category: "Dining",
	},
	{
		id: "3",
		title: "Luce Floor Lamp",
		slug: "luce-floor-lamp",
		price: 1850,
		image: lampImage,
		category: "Lighting",
	},
];

export function Showcase() {
	const { t } = useLanguage();
	const collections = getCollections().slice(0, 2);
	// Hero Section
	return (
		<>
			{/* Hero Section */}
			<section className="relative h-screen min-h-[700px] flex items-center">
				<div className="absolute inset-0 z-0 overflow-hidden">
					<img
						src={heroImage}
						alt="Luxury living room interior"
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-black/30" />
				</div>
				<div className="container-luxury relative z-10 w-full max-w-full overflow-hidden flex justify-center">
					<div className="w-full flex flex-col items-center">
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="text-caption mb-6"
						>
							{t("hero.curatedCollection")}
						</motion.p>
						<motion.h1
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.1 }}
							className="mb-4 text-center text-[clamp(3rem,8vw,10rem)] leading-[0.95] font-normal"
						>
							{t("hero.artOfLiving")}
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="text-lg mb-10 w-full text-center text-neutral-900"
						>
							{t("hero.subtitle")}
						</motion.p>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.3 }}
							className="flex flex-col sm:flex-row gap-4"
						>
							<Link to="/catalog" className="btn-luxury group">
								{t("hero.exploreCollection")}
								<ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
							</Link>
							<Link to="/about" className="btn-outline-luxury">
								{t("hero.ourStory")}
							</Link>
						</motion.div>
					</div>
				</div>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1, duration: 0.8 }}
					className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
				>
					<div className="flex flex-col items-center gap-3">
						<span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
							{t("hero.scroll")}
						</span>
						<div className="w-px h-12 bg-gradient-to-b from-muted-foreground to-transparent" />
					</div>
				</motion.div>
			</section>

			{/* Featured Products Section */}
			<section className="section-padding bg-secondary/30">
				<div className="container-luxury">
					<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
						<div>
							<p className="text-caption mb-4">{t("featured.title")}</p>
							<h2 className="heading-section">{t("featured.subtitle")}</h2>
						</div>
						<Link
							to="/"
							className="link-underline text-sm uppercase tracking-[0.15em] font-medium inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
						>
							{t("featured.viewAll")}
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>
					<motion.div
						variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-100px" }}
						className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
					>
						{featuredProducts.map((product) => (
							<motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
								<Link to={`/product/${product.slug}`} className="group block">
									<div className="product-card aspect-[4/5] mb-6 bg-muted">
										<img
										src={product.image}
											alt={product.title}
											className="product-image w-full h-full object-cover transition-transform duration-700"
										/>
										<div className="product-overlay absolute inset-0 bg-foreground/5 opacity-0 transition-opacity duration-300" />
									</div>
									<p className="text-caption mb-2 text-muted-foreground !important">{product.category}</p>
									<h3 className="heading-card mb-2 group-hover:text-muted-foreground transition-colors text-foreground !important">
										{product.title}
									</h3>
									<p className="font-sans text-muted-foreground text-sm">
										€{product.price.toLocaleString()}
									</p>
								</Link>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Philosophy Section */}
			<section className="section-padding">
				<div className="container-luxury">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
						{/* Image */}
						<motion.div
							initial={{ opacity: 0, x: -40 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
							className="relative aspect-[4/5] image-zoom"
						>
							<img
								src={craftsmanshipImage}
								alt="Artisan craftsmanship"
								className="w-full h-full object-cover"
							/>
						</motion.div>
						{/* Content */}
						<motion.div
							initial={{ opacity: 0, x: 40 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							viewport={{ once: true }}
							className="lg:pl-8"
						>
							<p className="text-caption mb-6">{t("philosophy.section")}</p>
							<h2 className="heading-section mb-8">
								{t("philosophy.title")}
								<br />
								<span className="italic">{t("philosophy.section")}</span>
							</h2>
							<div className="space-y-6 text-body">
								<p>{t("philosophy.description")}</p>
								<p>{t("philosophy.description2")}</p>
								<p>{t("philosophy.description3")}</p>
							</div>
							{/* Stats */}
							<div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-border">
								<div>
									<p className="font-serif text-3xl md:text-4xl mb-2">25+</p>
									<p className="text-caption">{t("philosophy.yearsOfExcellence")}</p>
								</div>
								<div>
									<p className="font-serif text-3xl md:text-4xl mb-2">150+</p>
									<p className="text-caption">{t("philosophy.masterArtisans")}</p>
								</div>
								<div>
									<p className="font-serif text-3xl md:text-4xl mb-2">40+</p>
									<p className="text-caption">{t("philosophy.countriesServed")}</p>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Collections Section */}
			<section className="section-padding bg-primary text-primary-foreground">
				<div className="container-luxury">
					<div className="text-center max-w-2xl mx-auto mb-16">
						<p className="text-caption mb-4 text-primary-foreground/60">
							{t("collections.explore")}
						</p>
						<h2 className="heading-section mb-6">
							{t("collections.title")}
						</h2>
						<p className="text-primary-foreground/70">
							{t("collections.description")}
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{collections.map((collection, index) => (
							<motion.div
								key={collection.id}
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<Link
									to={`/collections/${collection.slug}`}
									className="group block relative aspect-[16/10] overflow-hidden"
								>
									<img
										src={collection.image}
										alt={t(collection.nameKey)}
										className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
									<div className="absolute bottom-0 left-0 right-0 p-8">
										<div className="flex items-end justify-between">
											<div>
												<h3 className="font-serif text-2xl md:text-3xl text-white mb-2">
													{t(collection.nameKey)}
												</h3>
												<p className="text-white/70 text-sm max-w-xs">
													{t(collection.descriptionKey)}
												</p>
											</div>
											<div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-black">
												<ArrowUpRight className="w-5 h-5 text-white group-hover:text-black" />
											</div>
										</div>
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
