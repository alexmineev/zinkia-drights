/**
 * Author:  alexey.mineev
 * Created: 10-oct-2016
 */

DROP TABLE IF EXISTS `videos`;
CREATE TABLE IF NOT EXISTS `videos` (
  `id` varchar(50) NOT NULL,
  `title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_spanish_ci DEFAULT NULL,
  `channel` varchar(1000) CHARACTER SET utf8 COLLATE utf8_spanish_ci DEFAULT NULL,
  `views` int(11) DEFAULT NULL,
  `earnings` float DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `trimester` int(11) DEFAULT NULL,
  `thumbnail` text,
  `serie` varchar(1000) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `cms_id` varchar(255) NOT NULL,
  `channel_id` varchar(100) DEFAULT NULL,
  `season` int(11) DEFAULT NULL,
  `episode` int(11) DEFAULT NULL,
  `asset_id` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD KEY `cms_id_idx` (`cms_id`);

DROP TABLE IF EXISTS `videos_tmp`;
CREATE TABLE IF NOT EXISTS `videos_tmp` (
  `id` varchar(50) NOT NULL,
  `title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_spanish_ci DEFAULT NULL,
  `channel` varchar(1000) CHARACTER SET utf8 COLLATE utf8_spanish_ci DEFAULT NULL,
  `views` int(11) DEFAULT NULL,
  `earnings` float DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `trimester` int(11) DEFAULT NULL,
  `thumbnail` text,
  `serie` varchar(1000) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `cms_id` varchar(255) NOT NULL,
  `channel_id` varchar(100) DEFAULT NULL,
  `season` int(11) DEFAULT NULL,
  `episode` int(11) DEFAULT NULL,
  `asset_id` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

