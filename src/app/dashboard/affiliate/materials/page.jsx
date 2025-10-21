"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Download, Search, Copy, CheckCircle2, FileText, Image, Video, FileImage, Book, TrendingUp, Clock, Grid3x3, List } from "lucide-react";

export default function AffiliateMaterials() {
  const [materials, setMaterials] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [copiedId, setCopiedId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const materialTypes = [
    { id: "all", label: "All Materials", icon: Grid3x3 },
    { id: "BANNER", label: "Banners", icon: Image },
    { id: "PRODUCT_PHOTO", label: "Product Photos", icon: FileImage },
    { id: "COPYWRITING", label: "Copywriting", icon: FileText },
    { id: "VIDEO", label: "Videos", icon: Video },
    { id: "GUIDELINE", label: "Guidelines", icon: Book },
  ];

  useEffect(() => {
    fetchMaterials();
  }, [activeType, searchQuery]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeType !== "all") params.append("type", activeType);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/affiliate/materials?${params}`);
      const result = await response.json();

      if (result.success) {
        setMaterials(result.data.materials);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (material) => {
    try {
      setDownloadingId(material.id);

      const response = await fetch(`/api/affiliate/materials/${material.id}/download`, {
        method: "POST",
      });

      const result = await response.json();

      if (result.success) {
        await fetch(`/api/affiliate/materials/${material.id}/view`, {
          method: "POST",
        });

        window.open(result.data.downloadUrl, "_blank");
        fetchMaterials();
      }
    } catch (error) {
      console.error("Error downloading:", error);
      alert("Failed to download material");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredMaterials = materials.filter((m) => activeType === "all" || m.type === activeType);

  if (loading && materials.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Marketing Materials</h1>
            <p className="text-purple-100 text-lg">Professional assets to boost your affiliate success</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold">{materials.length}</div>
              <div className="text-xs text-purple-200">Total Assets</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {materialTypes.slice(1).map((type) => {
          const Icon = type.icon;
          const count = stats[type.id] || 0;
          return (
            <Card key={type.id} className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-xs text-gray-600">{type.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Type Filter */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                {materialTypes.map((type) => {
                  const Icon = type.icon;
                  const count = type.id === "all" ? materials.length : stats[type.id] || 0;

                  return (
                    <Button key={type.id} variant={activeType === type.id ? "default" : "outline"} size="sm" onClick={() => setActiveType(type.id)} className="gap-2">
                      <Icon className="w-4 h-4" />
                      {type.label}
                      <Badge variant="secondary" className="ml-1">
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search materials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid/List */}
      {filteredMaterials.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              viewMode={viewMode}
              onDownload={handleDownload}
              onCopy={handleCopy}
              copiedId={copiedId}
              downloadingId={downloadingId}
              formatFileSize={formatFileSize}
              formatDuration={formatDuration}
            />
          ))}
        </div>
      )}

      {/* Tips Section */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-purple-900 mb-3 text-lg">Pro Tips for Maximum Impact</h3>
              <ul className="grid md:grid-cols-2 gap-3 text-sm text-purple-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Always include your referral link in every promotion</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Customize copywriting to match your audience tone</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Use platform-specific materials for best results</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Post consistently - aim for 3-5x per week minimum</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MaterialCard({ material, viewMode, onDownload, onCopy, copiedId, downloadingId, formatFileSize, formatDuration }) {
  const typeConfig = {
    BANNER: { icon: Image, color: "blue", bgColor: "bg-blue-50" },
    PRODUCT_PHOTO: { icon: FileImage, color: "green", bgColor: "bg-green-50" },
    COPYWRITING: { icon: FileText, color: "purple", bgColor: "bg-purple-50" },
    VIDEO: { icon: Video, color: "red", bgColor: "bg-red-50" },
    GUIDELINE: { icon: Book, color: "amber", bgColor: "bg-amber-50" },
  };

  const config = typeConfig[material.type];
  const Icon = config.icon;

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 ${config.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-8 h-8 text-${config.color}-600`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{material.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{material.description}</p>
                </div>
                <Badge variant="secondary">{material.category}</Badge>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 mt-3">
                {material.fileFormat && (
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {material.fileFormat}
                  </div>
                )}
                {material.fileSize && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatFileSize(material.fileSize)}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {material.downloadCount} downloads
                </div>
                {material.hasDownloaded && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Downloaded
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {material.type === "COPYWRITING" && (
                <Button variant="outline" size="sm" onClick={() => onCopy(material.content, material.id)} disabled={copiedId === material.id}>
                  {copiedId === material.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              )}
              <Button onClick={() => onDownload(material)} disabled={downloadingId === material.id} size="sm">
                {downloadingId === material.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-xl transition-all h-full flex flex-col">
      <CardHeader>
        <div className={`aspect-video ${config.bgColor} rounded-lg flex items-center justify-center mb-4 relative overflow-hidden`}>
          <Icon className={`w-16 h-16 text-${config.color}-400`} />
          {material.hasDownloaded && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-green-500">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Downloaded
              </Badge>
            </div>
          )}
        </div>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{material.title}</CardTitle>
          <Badge variant="secondary" className="flex-shrink-0">
            {material.type.replace("_", " ")}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{material.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-2 mb-4 flex-1">
          {material.category && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">{material.category}</span>
            </div>
          )}
          {material.fileFormat && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Format:</span>
              <span className="font-medium">{material.fileFormat}</span>
            </div>
          )}
          {material.fileSize && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Size:</span>
              <span className="font-medium">{formatFileSize(material.fileSize)}</span>
            </div>
          )}
          {material.duration && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{formatDuration(material.duration)}</span>
            </div>
          )}
          {material.width && material.height && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Dimensions:</span>
              <span className="font-medium">
                {material.width}x{material.height}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Downloads:</span>
            <span className="font-medium">{material.downloadCount}x</span>
          </div>
        </div>

        <div className="flex gap-2">
          {material.type === "COPYWRITING" && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onCopy(material.content, material.id)} disabled={copiedId === material.id}>
              {copiedId === material.id ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          )}
          <Button className="flex-1" onClick={() => onDownload(material)} disabled={downloadingId === material.id} size="sm">
            {downloadingId === material.id ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
